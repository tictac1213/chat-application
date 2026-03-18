import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './config/db.js';
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import conversationRouter from './routes/conversation.route.js';
import messageRouter from './routes/message.route.js';

import initSocket from "./socket.js";

dotenv.config();
dbConnection();

const app = express();

/* ---------- CORS MUST BE FIRST ---------- */
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

/* ---------- BODY PARSER ---------- */
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/message', messageRouter);

/* ---------- HTTP SERVER ---------- */
const server = http.createServer(app);

/* ---------- SOCKET ---------- */
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

initSocket(io);

/* ---------- START SERVER ---------- */
server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`Listening to port: ${process.env.PORT || 3000}`);
});