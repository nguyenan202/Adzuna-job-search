
import WorkingTime from '../models/workingTime';
import { io } from '../index';

const getAllWorkingTime = async (req, res) => {

    try {
        const workingTimes = await WorkingTime.findAll();

        res.status(200).json(workingTimes);
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const getWorkingTimeById = async (req, res) => {

    try {
        const {
            id
        } = req.params

        const workingTime = await WorkingTime.findOne({
            where: {
                id
            }
        })

        res.status(200).json(workingTime);
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const createWorkingTime = async (req, res) => {

    try {
        const {
            name,
            description
        } = req.body;

        const workingTimeCreated = await WorkingTime.create({
            name,
            description
        })

        if (workingTimeCreated) {
            io.emit('update-working-time');

            return res.status(200).json({
                status: true,
                workingTime: workingTimeCreated
            })
        }

        res.status(400).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const updateWorkingTimeById = async (req, res) => {

    try {
        const {
            id,
            ...data
        } = req.body;

        const updatedRow = await WorkingTime.update(data, {
            where: {
                id
            }
        })

        if (updatedRow[0] === 1) {
            io.emit('update-working-time');
            return res.status(200).json({
                status: true
            })
        }

        res.status(400).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export {
    getAllWorkingTime,
    getWorkingTimeById,
    createWorkingTime,
    updateWorkingTimeById
}