import { useContext, createContext } from 'react';

export const AppContext = createContext(null);

export const useAppContext = () => useContext(AppContext);
