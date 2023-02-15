
import Speciallization from '../models/specialization';

import { io } from '../index';

const getAllSpecializationByJobId = async (req, res) => {

    try {
        const {
            jobId
        } = req.params;

        const specializations = await Speciallization.findAll({
            where: {
                jobId
            }
        })

        res.status(200).json(specializations);
    }catch(err) {
        res.status(500).json({ message: err });
    }
}

const createSpecializationByJobId = async (req, res) => {

    try {
        const {
            jobId,
            name
        } = req.body;

        const specializationCreated = await Speciallization.create({
            name,
            jobId
        })

        if( specializationCreated.id) {
            io.emit('update-specialization');
            return res.status(200).json({
                status: true,
                specialization: specializationCreated
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
    getAllSpecializationByJobId,
    createSpecializationByJobId
}