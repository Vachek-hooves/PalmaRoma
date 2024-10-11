import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Image, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5;
const CELL_SIZE = width * 0.9 / GRID_SIZE;
const INITIAL_RESOURCES = 10;
const CITY_COST = 3;
const ARMY_COST = 2;

const StackGameScreen = ({ route }) => {
  const { guideName, gameImage } = route.params;
  const [grid, setGrid] = useState(Array(GRID_SIZE * GRID_SIZE).fill(null));
  const [playerResources, setPlayerResources] = useState(INITIAL_RESOURCES);
  const [enemyResources, setEnemyResources] = useState(INITIAL_RESOURCES);
  const [turn, setTurn] = useState('player');
  const [gameOver, setGameOver] = useState(false);


  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newGrid = Array(GRID_SIZE * GRID_SIZE).fill(null);
    newGrid[0] = 'C'; // Player's starting city
    newGrid[GRID_SIZE * GRID_SIZE - 1] = 'EC'; // Enemy's starting city
    setGrid(newGrid);
    setPlayerResources(INITIAL_RESOURCES);
    setEnemyResources(INITIAL_RESOURCES);
    setTurn('player');
    setGameOver(false);
  };

  const handleCellPress = (index) => {
    if (gameOver || grid[index] !== null || turn !== 'player') return;
  
    const newGrid = [...grid];
    const adjacentToPlayer = getAdjacentCells(index).some(cell => newGrid[cell] === 'C' || newGrid[cell] === 'A');
  
    if (!adjacentToPlayer) {
      Alert.alert('Invalid Move', 'You can only expand to adjacent territories.');
      return;
    }
  
    let cost = 0;
    if (playerResources >= CITY_COST) {
      newGrid[index] = 'C';
      cost = CITY_COST;
    } else if (playerResources >= ARMY_COST) {
      newGrid[index] = 'A';
      cost = ARMY_COST;
    } else {
      Alert.alert('Not enough resources', 'Wait for more resources to accumulate.');
      return;
    }
  
    const newPlayerResources = playerResources - cost + countTerritories(newGrid, ['C', 'A']);
    
    setGrid(newGrid);
    setPlayerResources(newPlayerResources);
  
    if (checkVictory(newGrid)) {
      setGameOver(true);
      Alert.alert('Victory!', 'You have conquered the enemy city!', [
        {text: 'Play Again', onPress: initializeGame}
      ]);
    } else if (isGridFull(newGrid)) {
      endGame(newPlayerResources, enemyResources);
    } else {
      setTurn('enemy');
      setTimeout(() => enemyTurn(newGrid), 1000);
    }
  };

  const enemyTurn = (currentGrid) => {
    const newGrid = [...currentGrid];
    const enemyOptions = getEnemyOptions(newGrid);
    let newEnemyResources = enemyResources;
    let moveMade = false;
    
    if (enemyOptions.length > 0) {
      const randomIndex = Math.floor(Math.random() * enemyOptions.length);
      const chosenIndex = enemyOptions[randomIndex];
      
      if (newEnemyResources >= CITY_COST && Math.random() < 0.3) {
        newGrid[chosenIndex] = 'EC';
        newEnemyResources -= CITY_COST;
        moveMade = true;
      } else if (newEnemyResources >= ARMY_COST) {
        newGrid[chosenIndex] = 'EA';
        newEnemyResources -= ARMY_COST;
        moveMade = true;
      }
    }
  
    if (moveMade) {
      newEnemyResources += countTerritories(newGrid, ['EC', 'EA']);
    }
  
    setGrid(newGrid);
    setEnemyResources(newEnemyResources);
    
    if (checkDefeat(newGrid)) {
      setGameOver(true);
      Alert.alert('Defeat!', 'The enemy has conquered your city!', [
        {text: 'Try Again', onPress: initializeGame}
      ]);
    } else if (isGridFull(newGrid)) {
      endGame(playerResources, newEnemyResources);
    } else {
      setTurn('player');
    }
  };

  const getAdjacentCells = (index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const adjacent = [];
    if (row > 0) adjacent.push(index - GRID_SIZE);
    if (row < GRID_SIZE - 1) adjacent.push(index + GRID_SIZE);
    if (col > 0) adjacent.push(index - 1);
    if (col < GRID_SIZE - 1) adjacent.push(index + 1);
    return adjacent;
  };

  const countTerritories = (currentGrid, cellTypes) => {
    return currentGrid.filter(cell => cellTypes.includes(cell)).length;
  };

  const getEnemyOptions = (currentGrid) => {
    return currentGrid.reduce((options, cell, index) => {
      if (cell === null && getAdjacentCells(index).some(adj => currentGrid[adj] === 'EC' || currentGrid[adj] === 'EA')) {
        options.push(index);
      }
      return options;
    }, []);
  };

  const checkVictory = (currentGrid) => {
    return currentGrid[GRID_SIZE * GRID_SIZE - 1] === 'C' || currentGrid[GRID_SIZE * GRID_SIZE - 1] === 'A';
  };

  const checkDefeat = (currentGrid) => {
    return currentGrid[0] === 'EC' || currentGrid[0] === 'EA';
  };

  const isGridFull = (currentGrid) => {
    return !currentGrid.includes(null);
  };

  const endGame = (finalPlayerResources, finalEnemyResources) => {
    let message;
    if (finalPlayerResources > finalEnemyResources) {
      message = `Victory! You won with ${finalPlayerResources} resources to ${finalEnemyResources}`;
    } else if (finalEnemyResources > finalPlayerResources) {
      message = `Defeat! The enemy won with ${finalEnemyResources} resources to ${finalPlayerResources}`;
    } else {
      message = `It's a tie! Both have ${finalPlayerResources} resources`;
    }

    setGameOver(true);
    Alert.alert('Game Over', message, [
      {text: 'Play Again', onPress: initializeGame}
    ]);
  };



  // ... (all the state and game logic from TabBattleGameScreen)

  return (
    
    <ScrollView 
    // style={styles.container} 
    contentContainerStyle={styles.container}>
      <Text style={styles.title}>{guideName}'s Conquest</Text>
      <Image source={gameImage} style={styles.gameImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Turn: {turn === 'player' ? 'Your' : 'Enemy'}</Text>
        <Text style={styles.info}>Your Resources: {playerResources}</Text>
        <Text style={styles.info}>Enemy Resources: {enemyResources}</Text>
      </View>
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {grid.map((cell, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.cell,
                cell === 'C' && styles.playerCity,
                cell === 'A' && styles.playerArmy,
                cell === 'EC' && styles.enemyCity,
                cell === 'EA' && styles.enemyArmy,
              ]}
              onPress={() => handleCellPress(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.cellText}>{cell}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={initializeGame}>
        <Text style={styles.buttonText}>Reset Game</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5E6CA', // Light beige background
        padding: 20,
        height: '100%',
      },
      title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#8B4513', // Saddle brown color for title
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        textAlign: 'center',
        marginTop: 10,
      },
      infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#D2B48C', // Tan background for info container
        padding: 10,
        borderRadius: 10,
      },
      info: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5D4037', // Brown text color
      },
      gridContainer: {
        width: width * 0.9,
        aspectRatio: 1,
        backgroundColor: '#8B4513', // Saddle brown for grid border
        borderRadius: 10,
        padding: 3, // Add padding to create an even border
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      grid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#D2B48C', // Tan background for grid
        borderRadius: 7, // Slightly smaller to fit inside the container
      },
      cell: {
        width: `${100 / GRID_SIZE}%`,
        height: `${100 / GRID_SIZE}%`,
        borderWidth: 1,
        borderColor: '#8B4513', // Saddle brown border
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5DEB3', // Wheat color for empty cells
      },
      playerCity: {
        backgroundColor: '#DAA520', // Goldenrod for player cities
      },
      playerArmy: {
        backgroundColor: '#B8860B', // Dark goldenrod for player armies
      },
      enemyCity: {
        backgroundColor: '#8B0000', // Dark red for enemy cities
      },
      enemyArmy: {
        backgroundColor: '#A52A2A', // Brown for enemy armies
      },
      cellText: {
        fontSize: CELL_SIZE * 0.4,
        fontWeight: 'bold',
        color: '#FFF', // White text for contrast
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      button: {
        backgroundColor: '#CD853F', // Peru color for button
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        borderWidth: 2,
        borderColor: '#8B4513', // Saddle brown border
      },
      buttonText: {
        color: '#FFF', // White text
        fontSize: 18,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
  // ... (all styles from TabBattleGameScreen)
  gameImage: {
    width: width * 0.3,
    height: width * 0.5,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default StackGameScreen;