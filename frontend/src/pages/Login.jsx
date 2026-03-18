import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useEffect, useState } from "react";
import axios from "../api/axios";


export default function Login(){

    const navigate = useNavigate();
    const { login, user } = useAuth();

    useEffect(() => {
        // const { user } = useAuth();

        if(user){
            navigate("/chat");
        }
    }, [user]);



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post("/auth/log-in", {
                email: email, 
                password: password 
            });

            const data = await res.json();
            // console.log(data);
            
            

            if(!res.ok){
                if (Array.isArray(data.msg)) {
                    setError(data.msg[0]?.message || "Invalid input");
                } 
                else if (typeof data.msg === "object") {
                    setError(data.msg?.message || "Invalid input");
                } 
                else {
                    setError(data.msg || "Login failed");
                }

                return;
            }

            login(data.token);
            navigate("/chat");
        }
        catch(error){
            setError("Server Error");
            console.log("Login: " + error);
            
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-900">
            <form 
                onSubmit={handleLogin}
                className="bg-gray-800 p-8 w-80 text-white"
            >
                <h2 className="text-2xl mb-6 text-center font-bold">Login</h2>
                {error && <p className="text-red-400 mb-3">{error}</p>}

                <input 
                    className="w-full p-2 mb-3 rounded bg-gray-700"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full p-2 mb-3 rounded bg-gray-700"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded">
                    Login
                </button>

            </form>
        </div>
    );
}