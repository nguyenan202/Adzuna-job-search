import express from 'express'
import dotenv from 'dotenv'
import path from 'path';
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session'

const config = (app) => {

    dotenv.config();

    app.use(express.static(path.join('./src', 'public')));
    app.use(express.json());    
    app.use(express.urlencoded({ extended: true }));

    app.use(cors({
        origin: "http://localhost:3000",
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    }))
    app.use(morgan('common'))

    app.use(session({
        secret: 'longlongstringSecret',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 24*60*60*1000   // 1 day
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    //limit json req
    app.use(bodyParser.json({ limit: "30mb", extended: true }));
    app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
}

export default config