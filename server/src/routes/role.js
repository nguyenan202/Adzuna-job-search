import express from 'express'

import Role from '../models/role';
import {
    verifyTokenAdmin
} from '../middlewares/auth'
import User from '../models/user'

const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const roles = await Role.findAll();

        res.status(200).json(roles);
    }catch(err) {
        res.status(500).json({ message: err })
    }
})

router.patch('/', verifyTokenAdmin, async (req, res) => {

    try{
        const { userId, roleId } = req.body;

        const updateData = {
            roleId
        }

        const updatedRow = await User.update(updateData, {
            where: {
                id: userId
            }
        })

        res.status(200).json({ update: updatedRow[0] })
    }catch(err) {
        res.status(500).json({ message: err });
    }
})

export default router;