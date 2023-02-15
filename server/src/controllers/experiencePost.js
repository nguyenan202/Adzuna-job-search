
import ExperiencePost from '../models/experiencePost';

import { io } from '../index';

const getAllExperiencePost = async (req, res) => {

    try {
        const allEP = await ExperiencePost.findAll();

        res.status(200).json(allEP);
    }catch(err) {
        res.status(500).json({ message: err })
    }
}

const getExperiencePostById = async (req, res) => {

    try {
        const {
            id
        } = req.params

        const eP = await ExperiencePost.findOne({
            where: {
                id
            }
        })

        res.status(200).json(eP);
    }catch(err) {
        res.status(500).json({ message: err })
    }
}

const createExperiencePost = async (req, res) => {

    try {
        const {
            name,
            description
        } = req.body;

        const ePCreated = await ExperiencePost.create({
            name,
            description
        })

        if (ePCreated) {
            io.emit('update-experience-post');

            return res.status(200).json({
                status: true,
                level: ePCreated
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

const updateExperiencePostById = async (req, res) => {

    try {
        const {
            id,
            ...data
        } = req.body;

        const updatedRow = await ExperiencePost.update(data, {
            where: {
                id
            }
        })

        if (updatedRow[0] === 1) {
            io.emit('update-experience-post');
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
    getAllExperiencePost,
    getExperiencePostById,
    createExperiencePost,
    updateExperiencePostById
}