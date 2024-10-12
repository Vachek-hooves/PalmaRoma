import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Context = createContext();

const STORAGE_KEY = '@user_markers';
const GAME_RESULTS_KEY = '@game_results';
const USER_ARTICLES_KEY = '@user_articles';

export const ContextProvider = ({ children }) => {
  const [guide, setGuide] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [userMarkers, setUserMarkers] = useState([]);
  const [gameResults, setGameResults] = useState({});
  const [userArticles, setUserArticles] = useState([]);

  useEffect(() => {
    loadMarkers();
    loadGameResults();
    loadUserArticles();
  }, []);

  useEffect(() => {
    saveMarkers();
  }, [userMarkers]);

  useEffect(() => {
    saveGameResults();
  }, [gameResults]);

  const loadMarkers = async () => {
    try {
      const storedMarkers = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedMarkers !== null) {
        setUserMarkers(JSON.parse(storedMarkers));
      }
    } catch (error) {
      console.error('Error loading markers:', error);
    }
  };

  const saveMarkers = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userMarkers));
    } catch (error) {
      console.error('Error saving markers:', error);
    }
  };

  const loadGameResults = async () => {
    try {
      const storedResults = await AsyncStorage.getItem(GAME_RESULTS_KEY);
      if (storedResults !== null) {
        setGameResults(JSON.parse(storedResults));
      }
    } catch (error) {
      console.error('Error loading game results:', error);
    }
  };

  const saveGameResults = async () => {
    try {
      await AsyncStorage.setItem(GAME_RESULTS_KEY, JSON.stringify(gameResults));
    } catch (error) {
      console.error('Error saving game results:', error);
    }
  };

  const loadUserArticles = async () => {
    try {
      const storedArticles = await AsyncStorage.getItem(USER_ARTICLES_KEY);
      if (storedArticles !== null) {
        setUserArticles(JSON.parse(storedArticles));
      }
    } catch (error) {
      console.error('Error loading user articles:', error);
    }
  };

  const saveUserArticles = async () => {
    try {
      await AsyncStorage.setItem(USER_ARTICLES_KEY, JSON.stringify(userArticles));
    } catch (error) {
      console.error('Error saving user articles:', error);
    }
  };

  const addUserMarker = (newMarker) => {
    const markerWithId = { ...newMarker, id: Date.now().toString() };
    setUserMarkers(prevMarkers => [...prevMarkers, markerWithId]);
  };

  const removeUserMarker = (markerId) => {
    setUserMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
  };

  const saveGameResult = (guideName, result) => {
    setGameResults(prevResults => {
      const guideResults = prevResults[guideName] || { wins: 0, losses: 0, ties: 0 };
      const updatedGuideResults = {
        ...guideResults,
        [result]: guideResults[result] + 1
      };
      return {
        ...prevResults,
        [guideName]: updatedGuideResults
      };
    });
  };

  const getGameResults = (guideName) => {
    return gameResults[guideName] || { wins: 0, losses: 0, ties: 0 };
  };

  const addUserArticle = (newArticle) => {
    const articleWithId = { ...newArticle, id: Date.now().toString() };
    setUserArticles(prevArticles => {
      const updatedArticles = [...prevArticles, articleWithId];
      saveUserArticles(updatedArticles);
      return updatedArticles;
    });
  };

  return (
    <Context.Provider
      value={{
        guide,
        setGuide,
        guideData,
        setGuideData,
        userMarkers,
        addUserMarker,
        removeUserMarker,
        saveGameResult,
        getGameResults,
        userArticles,
        addUserArticle,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCustomContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useCustomContext must be used within a ContextProvider");
  }
  return context;
};
