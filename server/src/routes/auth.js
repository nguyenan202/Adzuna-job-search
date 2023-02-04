import express from 'express'
import passport from 'passport';
import dotenv from 'dotenv'
import {
    loginFailed,
    loginSuccess,
    nativeLogin,
    nativeRegister
} from '../controllers/auth';

const router = express.Router();
dotenv.config();

// Google
router.get('/google',
    passport.authenticate('google', ["profile"]));

router.get('/google/callback',
    passport.authenticate('google',
        {
            successRedirect: process.env.CLIENT_HOME_URL,
            failureRedirect: 'login/failed',
        })
)

router.get('/login/failed', loginFailed)

router.get('/login/success', loginSuccess)


// Facebook
router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect: process.env.CLIENT_HOME_URL,
            failureRedirect: 'login/failed',
        })
)


// native Login
router.post('/login', nativeLogin)


// register
router.post('/register', nativeRegister)

router.get('/logout', (req, res) => {
    req.logOut(() => {
        req.session.destroy(() => {
            res.redirect(process.env.CLIENT_HOME_URL);
        })
    });
})

export default router