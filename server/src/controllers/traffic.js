
import { Op } from 'sequelize';
import Traffic from '../models/traffic';

const createTraffic = async (req, res) => {
    try {
        const {
            userId
        } = req.body;

        //check user are visit system today
        const trafficToday = await Traffic.findOne({
            where: {
                userId,
                createdAt: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
                    [Op.lt]: new Date(new Date().setHours(24, 0, 0, 0)), // End of today
                }
            }
        })

        if (!trafficToday) {
            await Traffic.create({
                userId
            })
        }

        res.status(200).json({
            message: 'Success'
        });
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}


const getAll = async (req, res) => {
    try {
        const traffics = await Traffic.findAll();

        res.status(200).json(traffics);
    }catch(err) {
        res.status(500).json({
            message: err
        })
    }
}

export {
    createTraffic,
    getAll
}