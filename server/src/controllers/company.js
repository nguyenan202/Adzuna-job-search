import Company from "../models/company";
import SignCompany from '../models/signCompany';
import User from "../models/user";
import Address from '../models/address';
import Rate from '../models/rate';
import { io } from '../index';

import { fileURLToPath } from 'url'
import path from 'path';


const getCompanyByUserId = async (req, res) => {

    try {
        const {
            userId
        } = req.params

        Company.hasMany(Rate, { foreignKey: 'companyId' });
        Company.hasMany(Address, { foreignKey: 'companyId' });
        const company = await Company.findOne({
            where: {
                userId
            },
            include: [{
                model: Rate,
            },
            {
                model: Address
            }],
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
            status,
            comment
        } : {
            status
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

const updateInfo = async (req, res) => {

    try {
        const {
            id,
            ...data
        } = req.body;

        const updatedRow = await Company.update(data, {
            where: {
                id
            }
        })

        res.status(200).json({
            status: updatedRow[0] === 0 ? false : true,
            message: updatedRow[0] === 0 ? 'Có lỗi, vui lòng thử lại sau' : 'Cập nhật thông tin công ty thành công'
        });
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const updateImage = async (req, res) => {
    try {
        const {
            id
        } = req.body;

        const sampleFile = req.files.picture;
        const imageType = sampleFile.mimetype.replace('image/', '');

        const __filename = fileURLToPath(import.meta.url);
        let __dirname = path.dirname(__filename);
        __dirname = __dirname.replace('controllers', 'public\\images')

        const date = new Date().valueOf();
        const picturePath = `${date}.${imageType}`

        const uploadPath = path.join(__dirname, picturePath);

        sampleFile.mv(uploadPath, (err) => {
            if (err) return res.status(409).json({ message: err });
        })

        const updateRow = await Company.update({
            picturePath
        }, {
            where: {
                id
            }
        })

        if (updateRow[0] === 0) {
            return res.status(400).json({
                status: false,
                message: 'UpdateImage Failed'
            })
        }

        Company.hasMany(Rate, { foreignKey: 'companyId' });
        Company.hasMany(Address, { foreignKey: 'companyId' });
        const updatedCompany = await Company.findOne({
            where: {
                id
            },
            include: {
                model: Rate
            }
        })

        io.emit(`updated-company-${id}`, {
            status: true,
            company: updatedCompany
        });

        res.status(200).json({
            status: true,
            company: updatedCompany
        })
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const removeImage = async (req, res) => {
    try {
        const {
            id
        } = req.body

        const updatedRow = await Company.update({
            picturePath: null
        }, {
            where: {
                id
            }
        })

        if (updatedRow[0] === 0) {
            return res.status(400).json({
                status: false,
                message: 'UpdateImage Failed'
            })
        }


        Company.hasMany(Rate, { foreignKey: 'companyId' });
        Company.hasMany(Address, { foreignKey: 'companyId' });
        const updatedCompany = await Company.findOne({
            where: {
                id
            },
            include: {
                model: Rate
            }
        })

        io.emit(`updated-company-${id}`, {
            status: true,
            company: updatedCompany
        });

        res.status(200).json({
            status: true,
            company: updatedCompany
        })

    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const addAddress = async (req, res) => {

    try {
        const {
            companyId,
            name
        } = req.body

        const newAddress = await Address.create({
            name,
            companyId
        })

        if (newAddress) {
            Company.hasMany(Rate, { foreignKey: 'companyId' });
            Company.hasMany(Address, { foreignKey: 'companyId' });
            const updatedCompany = await Company.findOne({
                where: {
                    id: companyId
                },
                include: [{
                    model: Rate
                },
                {
                    model: Address
                }]
            })

            io.emit(`updated-company-${companyId}`, {
                status: true,
                company: updatedCompany
            });

            return res.status(200).json({
                status: true,
                company: updatedCompany
            })
        }


        res.status(200).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau.'
        })
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

export {
    getCompanyByUserId,
    getHistorySignByUserId,
    signCompany,
    getAllRequestCompany,
    updateStatus,
    updateInfo,
    updateImage,
    removeImage,
    addAddress
}