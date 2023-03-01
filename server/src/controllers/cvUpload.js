import CvUpload from '../models/cvUpload';
import { fileURLToPath } from 'url'
import path from 'path';

const createCvUpload = async (req, res) => {
    try {
        const {
            name,
            userId
        } = req.body;

        const sampleFile = req.files.picture;
        const imageType = sampleFile.mimetype.replace('application/', '');

        const __filename = fileURLToPath(import.meta.url);
        let __dirname = path.dirname(__filename);
        __dirname = __dirname.replace('controllers', 'public\\images')

        const date = new Date().valueOf();
        const picturePath = `${date}.${imageType}`

        const uploadPath = path.join(__dirname, picturePath);

        sampleFile.mv(uploadPath, (err) => {
            if (err) return res.status(409).json({ message: err });
        })

        const cvUpload = await CvUpload.create({
            name,
            userId,
            picturePath
        })

        if (cvUpload) return res.status(200).json({
            cvUpload
        })

        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const getAllCvUploadByUserId = async (req, res) => {
    try {
        const {
            userId
        } = req.params

        const allCvUpload = await CvUpload.findAll({
            where: {
                userId
            }
        })

        if (allCvUpload) return res.status(200).json({
            allCvUpload
        })

        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const updateCvUpload = async (req, res) => {
    try {
        const {
            id,
            name
        } = req.body;

        const updatedRow = await CvUpload.update({
            name
        }, {
            where: {
                id
            }
        })

        if (updatedRow) return res.status(200).json({
            updatedRow: updatedRow[0]
        })

        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const deleteCVUpload = async (req, res) => {
    try {
        const {
            id
        } = req.body;

        console.log(id);

        const deleteRow = await CvUpload.destroy({
            where: {
                id
            }
        });

        console.log(deleteRow);

        res.status(200).json({
            deleteRow
        })
    } catch (err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

export {
    createCvUpload,
    getAllCvUploadByUserId,
    updateCvUpload,
    deleteCVUpload
}