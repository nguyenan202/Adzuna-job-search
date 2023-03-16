import { Op } from "sequelize";
import CvApply from "../models/cvApply";
import User from "../models/user";
import Post from "../models/post";
import Company from "../models/company";


const createCvUpload = async (req, res) => {
    try {
        const {
            CVId,
            picturePath,
            description,
            userId,
            postId
        } = req.body

        const cvUploadCreated = await CvApply.create({
            CVId,
            picturePath,
            description,
            userId,
            postId
        })

        if (cvUploadCreated) return res.status(200).json({
            status: true,
            cvUploadCreated
        })

        res.status(400).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const getAllCvUploadByPostIdAndUserId = async (req, res) => {
    try {
        const {
            postId,
            userId
        } = req.params

        const cvUploaded = await CvApply.findAll({
            where: {
                postId,
                userId
            }
        })

        res.status(200).json({
            status: true,
            cvUploaded
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const getAllByPostId = async (req, res) => {
    try {
        const {
            postId
        } = req.params

        CvApply.belongsTo(User, { foreignKey: 'userId' });
        const allCvUpload = await CvApply.findAll({
            where: {
                postId,
                status: 0
            },
            include: [{
                model: User
            }]
        })

        res.status(200).json({
            status: true,
            allCvUpload
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const getAllByUserId = async (req, res) => {
    try {
        const {
            userId
        } = req.params;

        Post.belongsTo(Company, { foreignKey: 'companyId' });
        CvApply.belongsTo(Post, { foreignKey: 'postId' });
        const applies = await CvApply.findAll({
            where: {
                userId
            },
            include: [{
                model: Post,
                include: [{
                    model: Company
                }]
            }]
        })

        if (applies) return res.status(200).json({
            status: true,
            applies
        })

        res.status(400).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const updateStatus = async (req, res) => {
    try {
        const {
            status,
            comment,
            id
        } = req.body;

        if (comment && status === 2) {
            const updatedRow = await CvApply.update({
                status,
                comment
            }, {
                where: {
                    id
                }
            })

            return res.status(200).json({
                status: true,
                updatedRow: updatedRow[0]
            })
        }

        if (status === 1) {
            const updatedRow = await CvApply.update({
                status,
            }, {
                where: {
                    id
                }
            })

            return res.status(200).json({
                status: true,
                updatedRow: updatedRow[0]
            })
        }

        res.status(400).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const deleteCVApllyByPostId = async (req, res) => {
    try {
        const {
            id
        } = req.body;

        const deletedRow = await CvApply.destroy({
            where: {
                id
            }
        })

        res.status(200).json({
            deletedRow
        })
    }catch(err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

export {
    createCvUpload,
    getAllCvUploadByPostIdAndUserId,
    getAllByPostId,
    updateStatus,
    getAllByUserId,
    deleteCVApllyByPostId
}