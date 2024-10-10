import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Context = createContext();

const STORAGE_KEY = '@user_markers';

export const ContextProvider = ({ children }) => {
  const [guide, setGuide] = useState(null);
  const [guideData, setGuideData] = useState(null);
  const [userMarkers, setUserMarkers] = useState([]);

  useEffect(() => {
    loadMarkers();
  }, []);

  useEffect(() => {
    saveMarkers();
  }, [userMarkers]);

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

  const addUserMarker = (newMarker) => {
    const markerWithId = { ...newMarker, id: Date.now().toString() };
    setUserMarkers(prevMarkers => [...prevMarkers, markerWithId]);
  };

  const removeUserMarker = (markerId) => {
    setUserMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== markerId));
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
