import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket";

const AuthContext = createContext();


export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        // check token on refresh
        const token = localStorage.getItem("token");

        if(token) {
            try {
                const decoded = JSON.parse(atob(token.split(".")[1]));
                setUser({
                    id: decoded.id,
                    email: decoded.email,
                    username: decoded.username
                });

                const socket = connectSocket(token);
                socket.connect();
                
            }
            catch (err){
                localStorage.removeItem("token");
            }
        }
        
        setLoading(false);
        
    }, []);
    
    const login = (token) => {
        localStorage.setItem("token", token);
        
        const decoded = JSON.parse(atob(token.split(".")[1]));
        
        setUser({
            id: decoded.id,
            email: decoded.email,
            username: decoded.username
        });
        
        const socket = connectSocket(token);
        socket.connect();

    };

    const logout = () => {
        localStorage.removeItem("token");
        disconnectSocket();
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

}


export function useAuth(){
    return useContext(AuthContext);
}