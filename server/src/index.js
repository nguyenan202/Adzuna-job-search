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
import settingPermissionRouter from './routes/settingPermission';
import levelRouter from './routes/level';
import experiencePostRouter from './routes/experiencePost';
import workingTimeRouter from './routes/workingTime';
import jobRouter from './routes/job';
import specializationRouter from './routes/specialization';
import postRouter from './routes/post';
import postAddressRouter from './routes/postAddress';
import rateRouter from './routes/rate';

const app = express();

//Config
config(app);
configPassport();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_HOME_URL,
        methods: ['GET', 'POST']
    }
});

//Routing
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/permission', permissionRouter);
app.use('/setting-permission', settingPermissionRouter);
app.use('/role', roleRouter);
app.use('/company', companyRouter);
app.use('/level', levelRouter);
app.use('/experience-post', experiencePostRouter);
app.use('/working-time', workingTimeRouter);
app.use('/job', jobRouter);
app.use('/specialization', specializationRouter);
app.use('/post', postRouter);
app.use('/post-address', postAddressRouter);
app.use('/rate', rateRouter);

//io connect
io.on('connection', (socket) => {
    console.log(`user connected with ID: ${socket.id} And ${socket.handshake.query.loggeduser}`);

    socket.on('disconnect', () => {
        console.log(`user disconnected with ID: ${socket.id}`);
    })
});

//Port
const port = process.env.PORT
const hostName = process.env.HOST_NAME;

try {
    await connection();

    server.listen(port, hostName, () => {
        console.log(`Start running on port${port}`);
    })

} catch (err) {
    console.log(err);
}

export { io }