import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

let globalSetLoading = () => {}; // Global function to control spinner

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Assign the setLoading function to the global variable
  globalSetLoading = setLoading;

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Function to update the loading state globally
export const setGlobalLoading = (state) => {
  globalSetLoading(state);
};

export const useLoading = () => useContext(LoadingContext);
