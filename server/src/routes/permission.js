import express from 'express'

import Permission from '../models/permission';
import UserPermissions from '../models/userPermission';
import {
    verifyToken
} from '../middlewares/auth'

import { io } from '../index';

const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const permissions = await Permission.findAll();

        res.status(200).json(permissions);
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

router.patch('/', verifyToken, async (req, res) => {

    try {

        let {
            userId,
            permissions
        } = req.body;

        await UserPermissions.destroy({
            where: {
                userId
            }
        })

        const dataUpdate = permissions.map(permissionId => {

            return {
                userId,
                permissionId
            }
        })

        for(const data of dataUpdate) {
            await UserPermissions.create(data);
        }

        io.emit(`updated-permission-${userId}`);
        res.status(200).json({
            message: 'Update Permissions success.'
        })

    } catch (err) {
        res.status(500).json({ message: err })
    }
})

export default router;