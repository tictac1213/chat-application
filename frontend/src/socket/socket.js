import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
    if(socket)
        return socket;

    socket = io("http://192.168.31.197:3000/", {
        autoConnect: false
    });

    socket.connect();

    socket.on("connect", () => {
        socket.emit("authenticate", token);
    })

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if(socket) {
        socket.disconnect();
        socket = null;
    }
};