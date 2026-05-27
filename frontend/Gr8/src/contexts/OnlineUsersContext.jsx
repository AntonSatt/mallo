import ChatSignalrServices from "../services/ChatSignalrServices";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';

// this file is used to keep track of online users in the application. It uses the ChatSignalrServices to 
// listen for user online and offline events and updates the onlineUsers state accordingly. The context 
// provides a function isUserOnline to check if a specific user is currently online.

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({children}) => {

    const {isAuthenticated} = useAuth();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        if(!isAuthenticated){
            setOnlineUsers([]);
            return;
        }

        const setupPresence = async () => {

            ChatSignalrServices.onOnlineUsers((userIds) => {
                setOnlineUsers(userIds);
            });

            ChatSignalrServices.onUserOnline((userId) => {

                setOnlineUsers((prevUsers) => {

                    if (prevUsers.includes(userId)) {
                        return prevUsers;
                    }

                    return [...prevUsers, userId];
                });
            });

            ChatSignalrServices.onUserOffline((userId) => {

                setOnlineUsers((prevUsers) =>
                    prevUsers.filter((id) => id !== userId)
                );
            });

            await ChatSignalrServices.startConnection();
        };

        setupPresence();
    }, [isAuthenticated]);

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    return (
        <OnlineUsersContext.Provider value={{ onlineUsers, isUserOnline}}>
            {children}
        </OnlineUsersContext.Provider>
    );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useOnlineUsers = () => useContext(OnlineUsersContext);
