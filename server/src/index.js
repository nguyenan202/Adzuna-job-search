import express from 'express'
import config from './config/config';
import configPassport from './config/passport';
import googleRouter from './Routes/auth';
import { Sequelize } from 'sequelize'
import connection from './config/database';

const app = express();

//Config
config(app);
configPassport();

//Routing
app.use('/auth', googleRouter);


//Port
const port = process.env.PORT
const hostName = process.env.HOST_NAME;

try {
    await connection();

    app.listen(port, hostName, () => {
        console.log(`Start running on port${port}`);
    })
    
}catch(err) {
    console.log(err);
}