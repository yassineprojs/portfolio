import { createContext, useState, useContext } from "react";

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState("room");

  return (
    <LocationContext.Provider value={{ currentLocation, setCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
