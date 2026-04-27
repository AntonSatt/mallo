import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// This custom hook allows components to easily access the authentication context, 
// providing information about the current user and their authentication status. 
// By using this hook, components can determine if a user is logged in and access their 
// details without needing to directly interact with the context API.
export const useAuth = () => useContext(AuthContext);