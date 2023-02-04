import express from 'express'

import Permission from '../models/permission';
import UserPermissions from '../models/userPermission';
import {
    verifyTokenAdmin
} from '../middlewares/auth'

const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const permissions = await Permission.findAll();

        res.status(200).json(permissions);
    } catch (err) {
        res.status(500).json({ message: err })
    }
})

router.patch('/', verifyTokenAdmin, async (req, res) => {

    try {

        let {
            userId,
            permissions
        } = req.body;

        console.log(userId);
        console.log(permissions);

        //permissions = JSON.parse(permissions);

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

        res.status(200).json({
            message: 'Update Permissions success.'
        })

    } catch (err) {
        res.status(500).json({ message: err })
    }
})

export default router;