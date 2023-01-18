import bcrypt from 'bcrypt'
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import jwt from 'jsonwebtoken'
import User from '../models/user';
import Role from '../models/role';

const loginFailed = (req, res) => {
    res.status(400).json({
        status: false,
        message: 'Error, Plese try again'
    })
}

const loginSuccess = async (req, res) => {
    if (req.user) {

        const user = req.user;

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET)

        let userCreate;

        // create user object
        if (user.provider === 'google') {
            userCreate = {
                firstName: user._json.family_name,
                lastName: user._json.given_name,
                email: user._json.email,
                picturePath: user._json.picture,
                externalId: user._json.sub,
                externalType: user.provider,
                verified: user._json.email_verified
            }
        } else if (user.provider === 'facebook') {
            const nameSplit = user.displayName.split(' ');

            userCreate = {
                firstName: nameSplit.pop(),
                lastName: nameSplit.join(' '),
                picturePath: user.photos[0].value,
                externalId: user.id,
                externalType: user.provider
            }
        }

        // Check first time login
        const userCheck = await User.findOne({
            where: {
                externalId: userCreate.externalId
            }
        })

        // if first time login => add info to database
        if (!userCheck) {
            const userCreated = await User.create(userCreate);
            const userResponse = await userCreated.toJSON();
            
            return res.status(200).json({
                user: userResponse,
                token
            });
        }

        const userResponse = await userCheck.toJSON();
        
        res.status(200).json({
            user: userResponse,
            token
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
    }
}

const nativeLogin = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body

        const user = await User.findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(400).json({
                message: 'User does not exist.'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid password.'
            })
        }

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET)

        const userJson = user.toJSON();

        delete userJson.password;

        res.status(200).json({
            user: userJson,
            token
        })

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

}

const nativeRegister = async (req, res) => {

    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body

        const salt = await bcrypt.genSalt();
        const passwordBcrypt = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: passwordBcrypt
        })

        delete user.password

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: err })
    }

}

export {
    loginFailed,
    loginSuccess,
    nativeLogin,
    nativeRegister
}