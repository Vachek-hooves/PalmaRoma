import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5;
const CELL_SIZE = width * 0.9 / GRID_SIZE;
const INITIAL_RESOURCES = 10;
const CITY_COST = 3;
const ARMY_COST = 2;

const TabBattleGameScreen = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roman Conquest</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  gridContainer: {
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  playerCity: {
    backgroundColor: '#4CAF50',
  },
  playerArmy: {
    backgroundColor: '#8BC34A',
  },
  enemyCity: {
    backgroundColor: '#F44336',
  },
  enemyArmy: {
    backgroundColor: '#FF5722',
  },
  cellText: {
    fontSize: CELL_SIZE * 0.4,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TabBattleGameScreen;