import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Home from "./pages/Home";


function ProtectedRoute({ children }){
  const { user, loading } = useAuth();

  if(loading)
    return null;

  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
       
       
        <Route 
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat/>
            </ProtectedRoute>
          }
        />
      
      
      </Routes>
    </BrowserRouter>
  );
}

