import CV from "../models/cv"
import Education from '../models/education';
import Skill from '../models/skill';
import Experience from '../models/experience';
import Certification from '../models/certification';
import { sequelize } from "../config/database";

import { fileURLToPath } from 'url'
import path from 'path';

const createCV = async (req, res) => {

    try {
        const {
            name,
            fullName,
            dob,
            phone,
            email,
            address,
            userId
        } = req.body

        const cvCreated = await CV.create({
            name,
            fullName,
            dob,
            phone,
            email,
            address,
            userId
        });

        if (cvCreated) {
            Education.create({ CVId: cvCreated.id });
            Skill.create({ CVId: cvCreated.id });
            Experience.create({ CVId: cvCreated.id });
            Certification.create({ CVId: cvCreated.id });

            return res.status(200).json({
                status: true,
                cvCreated
            })
        }

        res.status(400).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })

    } catch (err) {
        res.status(500).json({
            status: false,
        })
    }
}

const getAllCVByUserId = async (req, res) => {

    try {
        const {
            userId
        } = req.params;

        const resums = await CV.findAll({
            where: {
                userId
            }
        })

        if (resums) return res.status(200).json({
            status: true,
            resums
        })

        res.status(404).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err
        })
    }
}

const getCvById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        CV.hasMany(Education, { foreignKey: 'cvId' });
        CV.hasMany(Skill, { foreignKey: 'cvId' });
        CV.hasMany(Experience, { foreignKey: 'cvId' });
        CV.hasMany(Certification, { foreignKey: 'cvId' });
        const cv = await CV.findOne({
            where: {
                id
            }, include: [{
                model: Education
            }, {
                model: Skill
            }, {
                model: Experience
            }, {
                model: Certification
            }]
        })

        if (cv) return res.status(200).json({
            status: true,
            cv
        })

        res.status(404).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err
        })
    }
}

const deleteResume = async (req, res) => {
    try {
        const result = await sequelize.transaction(async (t) => {

            const {
                id
            } = req.body;

            Education.destroy({ where: { CVId: id }, transaction: t });
            Skill.destroy({ where: { CVId: id }, transaction: t });
            Experience.destroy({ where: { CVId: id }, transaction: t });
            Certification.destroy({ where: { CVId: id }, transaction: t });

            const del = await CV.destroy({
                where: {
                    id
                },
                transaction: t
            })

            if (del) return res.status(200).json({
                status: true,
                deleteRow: del
            })

            res.status(404).json({
                status: false,
                message: 'Not Found'
            })
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Bạn không thể xóa CV đã ứng tuyển'
        })
    }
}

const updatePictureCV = async (req, res) => {
    try {
        const {
            id
        } = req.body;

        const sampleFile = req.files.picture;
        const imageType = sampleFile.mimetype.replace('image/', '');

        const __filename = fileURLToPath(import.meta.url);
        let __dirname = path.dirname(__filename);
        __dirname = __dirname.replace('controllers', 'public\\images');

        const date = new Date().valueOf();
        const picturePath = `${date}.${imageType}`

        const uploadPath = path.join(__dirname, picturePath);

        sampleFile.mv(uploadPath, (err) => {
            if (err) return res.status(409).json({ message: err });
        })

        await CV.update({
            picturePath
        }, {
            where: {
                id
            }
        })

        res.status(200).json({
            status: true,
            message: `Thành Công id: ${id}`
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const updateCV = async (req, res) => {
    try {
        const data = req.body;


        const result = await sequelize.transaction(async (t) => {

            //Update CV table
            await CV.update({
                name: data.name,
                position: data.position,
                overView: data.overView,
                fullName: data.fullName,
                gender: data.gender,
                dob: data.dob,
                phone: data.phone,
                email: data.email,
                address: data.address
            }, {
                transaction: t,
                where: {
                    id: data.id
                }
            })

            // Update Skills Table

            // Lấy tất cả id của Skill trong CV
            const skillIds = (await Skill.findAll({
                transaction: t,
                where: {
                    CVId: data.id
                }
            })).map(skill => skill.id);

            for (let skillId of skillIds) {
                // Xóa những row không trùng với id trả về
                if (!data.Skills.some(skill => skill.id === skillId)) {
                    await Skill.destroy({
                        transaction: t,
                        where: {
                            id: skillId
                        }
                    })
                }

                // Update lại những row còn
                if (data.Skills.some(skill => skill.id === skillId)) {
                    await Skill.update({
                        name: data.Skills.find(skill => skill.id === skillId).name,
                    }, {
                        transaction: t,
                        where: {
                            id: skillId
                        }
                    })
                }
            }

            // Add những row k có trong table
            for (let skill of data.Skills) {
                if (skillIds.every(skillId => skillId !== skill.id)) {
                    await Skill.create({
                        name: skill.name,
                        CVId: data.id
                    }, {
                        transaction: t
                    })
                }
            }

            // Update Education Table

            // Lấy tất cả id của Education trong CV
            const educationIds = (await Education.findAll({
                transaction: t,
                where: {
                    CVId: data.id
                }
            })).map(edu => edu.id);

            for (let eduId of educationIds) {
                // Xóa những row không trùng với id trả về
                if (!data.Education.some(edu => edu.id === eduId)) {
                    await Education.destroy({
                        transaction: t,
                        where: {
                            id: eduId
                        }
                    })
                }

                //Update lại những row còn
                if (data.Education.some(edu => edu.id === eduId)) {
                    const educate = data.Education.find(edu => edu.id === eduId);
                    await Education.update({
                        name: educate.name,
                        description: educate.description,
                        startAt: educate.startAt,
                        endAt: educate.endAt
                    }, {
                        transaction: t,
                        where: {
                            id: eduId
                        }
                    })
                }
            }

            // Add những row k có trong table
            for (let edu of data.Education) {
                if (educationIds.every(eduId => eduId !== edu.id)) {
                    await Education.create({
                        name: edu.name,
                        description: edu.description,
                        startAt: edu.startAt,
                        endAt: edu.endAt,
                        CVId: data.id
                    }, {
                        transaction: t
                    })
                }
            }


            // Update Experience Table

            // Lấy tất cả id của Education trong CV
            const expIds = (await Experience.findAll({
                transaction: t,
                where: {
                    CVId: data.id
                }
            })).map(exp => exp.id);

            for (let expId of expIds) {
                // Xóa những row không trùng với id trả về
                if (!data.Experiences.some(exp => exp.id === expId)) {
                    await Experience.destroy({
                        transaction: t,
                        where: {
                            id: expId
                        }
                    })
                }

                //Update lại những row còn
                if (data.Experiences.some(exp => exp.id === expId)) {
                    const experience = data.Experiences.find(exp => exp.id === expId);
                    await Experience.update({
                        name: experience.name,
                        description: experience.description,
                        startAt: experience.startAt,
                        endAt: experience.endAt
                    }, {
                        transaction: t,
                        where: {
                            id: expId
                        }
                    })
                }
            }

            // Add những row k có trong table
            for (let exp of data.Experiences) {
                if (expIds.every(expId => expId !== exp.id)) {
                    await Experience.create({
                        name: exp.name,
                        description: exp.description,
                        startAt: exp.startAt,
                        endAt: exp.endAt,
                        CVId: data.id
                    }, {
                        transaction: t
                    })
                }
            }


            // Update Certification Table

            // Lấy tất cả id của Education trong CV
            const cerIds = (await Certification.findAll({
                transaction: t,
                where: {
                    CVId: data.id
                }
            })).map(cer => cer.id);

            for (let cerId of cerIds) {
                // Xóa những row không trùng với id trả về
                if (!data.Certifications.some(cer => cer.id === cerId)) {
                    await Certification.destroy({
                        transaction: t,
                        where: {
                            id: cerId
                        }
                    })
                }

                //Update lại những row còn
                if (data.Certifications.some(cer => cer.id === cerId)) {
                    const certification = data.Certifications.find(cer => cer.id === cerId);
                    await Certification.update({
                        name: certification.name,
                        description: certification.description
                    }, {
                        transaction: t,
                        where: {
                            id: cerId
                        }
                    })
                }
            }

            // Add những row k có trong table
            for (let cer of data.Certifications) {
                if (cerIds.every(cerId => cerId !== cer.id)) {
                    await Certification.create({
                        name: cer.name,
                        description: cer.description,
                        CVId: data.id
                    }, {
                        transaction: t
                    })
                }
            }

        });

        res.status(200).json({
            status: true,
            message: 'Thành Công'
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

export {
    createCV,
    getAllCVByUserId,
    deleteResume,
    getCvById,
    updateCV,
    updatePictureCV
}