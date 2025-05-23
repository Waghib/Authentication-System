import { createContext, useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Set default axios config for all requests
    useEffect(() => {
        // Global axios configuration
        axios.defaults.withCredentials = true;
    }, []);

    const getAuthStatus = async () => {
        try {
            console.log("Checking auth status...");
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth');
            console.log("Auth status response:", data);
            if (data.status) {
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            console.error("Error fetching auth status:", error);
            // Don't show error toast on initial load
            // toast.error(error.response?.data?.message || "Failed to fetch auth status");
            setIsLoggedin(false);
        }
    }

    useEffect(() => {
        getAuthStatus();
    }, []);
    
    const getUserData = async () => {
        try {
            setIsLoading(true);
            const {data} = await axios.get(backendUrl + '/api/user/data');
            if (data.status) {
                console.log("User data:", data.userData);
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error(error.response?.data?.message || "Failed to fetch user data");
            setIsLoading(false);
        }
    }
    
    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        isLoading,
        getAuthStatus
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
