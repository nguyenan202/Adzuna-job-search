import Role from "../models/role";
import User from '../models/user';
import { io } from '../index';

const getAllRole = async (req, res) => {

    try {
        const roles = await Role.findAll();

        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const updateRole = async (req, res) => {

    try {
        const { userId, roleId } = req.body;

        const updateData = {
            roleId
        }
        
        const updatedRow = await User.update(updateData, {
            where: {
                id: userId
            }
        })

        io.emit(`updated-role-userId-${userId}`);
        res.status(200).json({ update: updatedRow[0] })
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

const createRole = async (req, res) => {

    try {
        const {
            name
        } = req.body

        const roleCreated = await Role.create({
            name
        })

        if (roleCreated) {
            io.emit('updated-role');

            return res.status(200).json({
                status: true,
                role: roleCreated
            })
        }

        res.status(400).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }catch(err) {
        res.status(500).json({ message: err })
    }
}

export {
    getAllRole,
    updateRole,
    createRole
}