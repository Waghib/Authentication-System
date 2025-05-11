import { createContext, useState } from "react";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const getUserData = async () => {
        try {
            setIsLoading(true);
            axios.defaults.withCredentials = true;
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
        isLoading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
