
import Job from '../models/job';

import { io } from '../index';
import Specialization from '../models/specialization';

const getAllJob = async (req, res) => {

    try {
        Job.hasMany(Specialization, { foreignKey: 'jobId' });
        const jobs = await Job.findAll({
            include: [{
                model: Specialization
            }]
        });

        res.status(200).json(jobs);
    }catch(err) {
        res.status(500).json({ message: err })
    }
}

const createJob = async (req, res) => {

    try {
        const {
            name
        } = req.body;

        const jobCreated = await Job.create({
            name
        })

        if (jobCreated.id) {
            io.emit('update-job');
            return res.status(200).json({
                status: true,
                job: jobCreated
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
    getAllJob,
    createJob
}