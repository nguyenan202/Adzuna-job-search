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
import cvRouter from './routes/cv';
import cvApplyRouter from './routes/cvApply';
import cvUploadRouter from './routes/cvUpload';
import roomChatRouter from './routes/roomChat';
import messageRouter from './routes/message';
import pdfRouter from './routes/pdf';
import { usersOnline } from './data';

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
app.use('/cv', cvRouter);
app.use('/cv-apply', cvApplyRouter);
app.use('/cv-upload', cvUploadRouter);
app.use('/room-chat', roomChatRouter);
app.use('/message', messageRouter);
app.use('/pdf', pdfRouter);

//io connect
io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;
    usersOnline.setValue(userId);
    io.emit(`update-online`, usersOnline.value);

    socket.on('disconnect', () => {
        usersOnline.filterValue(userId);
        io.emit(`update-online`, usersOnline.value);
    });
    
    socket.on('user-online', (id) => {
        usersOnline.setValue(id);
        io.emit(`update-online`, usersOnline.value);
    })

    socket.on('user-offline', (id) => {
        usersOnline.filterValue(id);
        io.emit(`update-online`, usersOnline.value);
    })
    
    socket.on(`first-mounted-${userId}`, () => {
        io.emit(`update-online`, usersOnline.value);
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