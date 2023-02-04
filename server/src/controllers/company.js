import Company from "../models/company";
import SignCompany from '../models/signCompany';
import User from "../models/user";
import { io } from '../index'

const getCompanyByUserId = async (req, res) => {

    try {
        const {
            userId
        } = req.params

        const company = await Company.findOne({
            where: {
                userId
            }
        })


        if (company) return res.status(200).json(company)

        res.status(404).json({
            message: 'Not found.'
        })

    } catch (err) {
        res.status(200).json({ message: err })
    }
}

const getHistorySignByUserId = async (req, res) => {

    try {
        const {
            userId
        } = req.params

        const signCompanies = await SignCompany.findAll({
            where: {
                userId
            }
        })

        if (signCompanies) return res.status(200).json(signCompanies)

        res.status(404).json({
            message: 'Not found.'
        })

    } catch (err) {
        res.status(200).json({ message: err })
    }
}

const signCompany = async (req, res) => {

    try {
        const {
            ...companyInfo
        } = req.body

        /**
         *  status:
         *      0: pending
         *      1: accept
         *      2: reject
         */
        const signCompany = await SignCompany.create({
            ...companyInfo,
            status: 0
        })

        io.emit('has-request-company')
        res.status(200).json(signCompany)
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const getAllRequestCompany = async (req, res) => {
    
    try {

        SignCompany.belongsTo(User);
        const requestCompanies = await SignCompany.findAll({
            where: {
                status: 0
            },
            include: {
                model: User
            }
        })

        res.status(200).json(requestCompanies)
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const updateStatus = async (req, res) => {

    try {
        const {
            companyId,
            userId,
            status,
            comment
        } = req.body

        await SignCompany.update(status === 2 ? {
            status
        } : {
            status,
            comment
        }, {
            where: {
                id: companyId
            }
        })

        // status === 1 -> Tao cong ty cho user có id = userId
        if (status === 1) {

            const infoSignCompany = await SignCompany.findOne({
                where: {
                    id: companyId
                }
            })

            const data = {
                name: infoSignCompany.name,
                userId
            }

            const company = await Company.create(data)
            io.emit(`approved-company-userId-${userId}`, company);

            return res.status(200).json(company)
        }

        // status !== 1 -> trả về message đã update status
        io.emit(`approved-company-userId-${userId}`, {
            status: 2
        });
        res.status(201).json({ message: 'Updated status.' })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

export {
    getCompanyByUserId,
    getHistorySignByUserId,
    signCompany,
    getAllRequestCompany,
    updateStatus
}