import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import config from './config/config';
import configPassport from './config/passport';
import connection from './config/database';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import permissionRouter from './routes/permission';
import roleRouter from './routes/role';
import companyRouter from './routes/company';

const app = express();

//Config
config(app);
configPassport();

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: process.env.CLIENT_HOME_URL,
        methods: ['GET','POST']
    }
});

//Routing
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/permission', permissionRouter);
app.use('/role', roleRouter);
app.use('/company', companyRouter);

//io connect
io.on('connection', (socket) => {
    console.log(`user connected with ID: ${socket.id}`);
})

export { io }

//Port
const port = process.env.PORT
const hostName = process.env.HOST_NAME;

try {
    await connection();

    server.listen(port, hostName, () => {
        console.log(`Start running on port${port}`);
    })
    
}catch(err) {
    console.log(err);
}