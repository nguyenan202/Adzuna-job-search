import Level from "../models/level";

import { io } from '../index';

const getAllLevel = async (req, res) => {

    try {
        const levels = await Level.findAll();

        res.status(200).json(levels);
    }catch(err) {
        res.status(500).json({ message: err })
    }
}

const getLevelById = async (req, res) => {

    try {
        const {
            id
        } = req.params

        const level = await Level.findOne({
            where: {
                id
            }
        })

        res.status(200).json(level);
    }catch(err) {
        res.status(500).json({ message: err })
    }
}

const createLevel = async (req, res) => {

    try {
        const {
            name,
            description
        } = req.body;

        const levelCreated = await Level.create({
            name,
            description
        })

        if (levelCreated) {
            io.emit('update-level');

            return res.status(200).json({
                status: true,
                level: levelCreated
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

const updateLevelById = async (req, res) => {

    try {
        const {
            id,
            ...data
        } = req.body;

        const updatedRow = await Level.update(data, {
            where: {
                id
            }
        })

        if (updatedRow[0] === 1) {
            io.emit('update-level');
            return res.status(200).json({
                status: true
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
    getAllLevel,
    getLevelById,
    createLevel,
    updateLevelById
}