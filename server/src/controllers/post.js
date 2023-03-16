import { Op } from 'sequelize';
import { io } from '../index';

import Post from '../models/post';
import Specialization from '../models/specialization';
import Level from '../models/level';
import ExperiencePost from '../models/experiencePost';
import WorkingTime from '../models/workingTime';
import PostAddress from '../models/postAddress';
import Address from '../models/address';
import Company from '../models/company';
import { sequelize } from '../config/database';
import CvApply from '../models/cvApply';

const getAllPostInCurrentMonth = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const currentMonthStart = new Date().toISOString().slice(0, 7) + '-01';
        const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10);


        const posts = await Post.findAll({
            where: {
                startAt: {
                    [Op.between]: [currentMonthStart, currentMonthEnd]
                },
                companyId: id
            }
        })

        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

const getAllPost = async (req, res) => {
    try {

        Post.belongsTo(Specialization, { foreignKey: 'specializationId' });
        Post.belongsTo(Level, { foreignKey: 'levelId' });
        Post.belongsTo(ExperiencePost, { foreignKey: 'experiencePostId' });
        Post.belongsTo(WorkingTime, { foreignKey: 'workingTimeId' });
        PostAddress.belongsTo(Address, { foreignKey: 'addressId' })
        Post.hasMany(PostAddress, { foreignKey: 'postId' });
        Post.belongsTo(Company, { foreignKey: 'companyId' });
        const posts = await Post.findAll({
            include: [{
                model: Specialization
            }, {
                model: Level
            }, {
                model: ExperiencePost
            }, {
                model: WorkingTime
            }, {
                model: PostAddress,
                include: [{
                    model: Address
                }]
            }, {
                model: Company
            }]
        });

        res.status(200).json({
            status: true,
            posts
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err
        })
    }
}

const getAllPostPending = async (req, res) => {
    try {

        Post.belongsTo(Specialization, { foreignKey: 'specializationId' });
        Post.belongsTo(Level, { foreignKey: 'levelId' });
        Post.belongsTo(ExperiencePost, { foreignKey: 'experiencePostId' });
        Post.belongsTo(WorkingTime, { foreignKey: 'workingTimeId' });
        PostAddress.belongsTo(Address, { foreignKey: 'addressId' })
        Post.hasMany(PostAddress, { foreignKey: 'postId' });
        Post.belongsTo(Company, { foreignKey: 'companyId' });
        const posts = await Post.findAll({
            include: [{
                model: Specialization
            }, {
                model: Level
            }, {
                model: ExperiencePost
            }, {
                model: WorkingTime
            }, {
                model: PostAddress,
                include: [{
                    model: Address
                }]
            }, {
                model: Company
            }],
            where: {
                status: 0
            }
        });

        res.status(200).json({
            status: true,
            posts
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err
        })
    }
}

const getPostById = async (req, res) => {
    try {
        const {
            id
        } = req.params

        Post.belongsTo(Specialization, { foreignKey: 'specializationId' });
        Post.belongsTo(Level, { foreignKey: 'levelId' });
        Post.belongsTo(ExperiencePost, { foreignKey: 'experiencePostId' });
        Post.belongsTo(WorkingTime, { foreignKey: 'workingTimeId' });
        PostAddress.belongsTo(Address, { foreignKey: 'addressId' })
        Post.hasMany(PostAddress, { foreignKey: 'postId' });
        Post.belongsTo(Company, { foreignKey: 'companyId' });
        const post = await Post.findOne({
            include: [{
                model: Specialization
            }, {
                model: Level
            }, {
                model: ExperiencePost
            }, {
                model: WorkingTime
            }, {
                model: PostAddress,
                include: [{
                    model: Address
                }]
            }, {
                model: Company
            }],
            where: {
                id
            }
        })

        if (post) return res.status(200).json({
            status: true,
            post
        })

        res.status(404).json({
            status: false,
            message: 'Not Found'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi'
        })
    }
}

const getAllPostActive = async (req, res) => {
    try {
        Post.belongsTo(Specialization, { foreignKey: 'specializationId' });
        Post.belongsTo(Level, { foreignKey: 'levelId' });
        Post.belongsTo(ExperiencePost, { foreignKey: 'experiencePostId' });
        Post.belongsTo(WorkingTime, { foreignKey: 'workingTimeId' });
        PostAddress.belongsTo(Address, { foreignKey: 'addressId' })
        Post.hasMany(PostAddress, { foreignKey: 'postId' });
        Post.belongsTo(Company, { foreignKey: 'companyId' });
        let posts = await Post.findAll({
            include: [{
                model: Specialization
            }, {
                model: Level
            }, {
                model: ExperiencePost
            }, {
                model: WorkingTime
            }, {
                model: PostAddress,
                include: [{
                    model: Address
                }]
            }, {
                model: Company
            }],
            where: {
                status: 1
            }
        })

        posts = posts.filter(post => {
            const timeLeft = Math.floor((new Date(post.endAt) - new Date()) / (1000 * 60 * 60 * 24)) + 1;
            return timeLeft > 0;
        })

        if (posts) return res.status(200).json({
            status: true,
            posts
        })

        res.status(400).json({
            status: false,
            message: 'Không tìm thấy'
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vùi lòng thử lại sau'
        })
    }
}

const getAllPostActiveWithSearch = async (req, res) => {

    try {
        const {
            name
        } = req.params;
        const {
            salary_start,
            salary_end,
            location,
            specializationId
        } = req.query

        const searchValue = name === ':name' ? '' : name;

        Post.belongsTo(Company, { foreignKey: 'companyId' });
        PostAddress.belongsTo(Address, { foreignKey: 'addressId' })
        Post.hasMany(PostAddress, { foreignKey: 'postId' });
        let posts = await Post.findAll({
            where: {
                title: {
                    [Op.like]: `%${searchValue}%`
                },
                salary: {
                    [Op.between]: [salary_start, salary_end]
                },
                specializationId,
                status: 1
            },
            include: [{
                model: Company
            }, {
                model: PostAddress,
                include: [{
                    model: Address
                }]
            }]
        })

        // filter location
        posts = posts.filter(post => {
            const timeLeft = Math.floor((new Date(post.endAt) - new Date()) / (1000 * 60 * 60 * 24)) + 1;
            
            return post.PostAddresses.map(address => address.Address.name).some(address => address.includes(location)) && timeLeft > 0
        })

        res.status(200).json({
            status: true,
            posts
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Có lỗi, vùi lòng thử lại sau'
        })
    }
}

const createPost = async (req, res) => {
    try {
        const data = req.body;

        const postCreated = await Post.create(data);

        if (postCreated.id) {
            return res.status(200).json({
                status: true,
                post: postCreated
            })
        }

        res.status(400).json({
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

const getAllPostByCompanyId = async (req, res) => {

    try {
        const {
            companyId
        } = req.params

        Post.belongsTo(Specialization, { foreignKey: 'specializationId' });
        Post.belongsTo(Level, { foreignKey: 'levelId' });
        Post.belongsTo(ExperiencePost, { foreignKey: 'experiencePostId' });
        Post.belongsTo(WorkingTime, { foreignKey: 'workingTimeId' });
        PostAddress.belongsTo(Address, { foreignKey: 'addressId' })
        Post.hasMany(PostAddress, { foreignKey: 'postId' });
        const posts = await Post.findAll({
            where: {
                companyId
            },
            include: [{
                model: Specialization
            }, {
                model: Level
            }, {
                model: ExperiencePost
            }, {
                model: WorkingTime
            }, {
                model: PostAddress,
                include: [{
                    model: Address
                }]
            }]
        })

        res.status(200).json({
            status: true,
            posts
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err
        })
    }
}

const updateStatusPost = async (req, res) => {
    try {
        const {
            companyId,
            postId,
            ...data
        } = req.body

        const updatedRow = await Post.update(data, {
            where: {
                id: postId
            }
        })

        if (updatedRow[0] !== 0) {
            io.emit(`update-posts-companyId-${companyId}`);
            return res.status(200).json({
                status: true,
                message: 'Success'
            })
        }

        res.status(200).json({
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

const changeDatePost = async (req, res) => {
    try {
        const {
            id,
            endAt
        } = req.body;

        const updatedRow = await Post.update({
            endAt
        }, {
            where: {
                id
            }
        })

        if (updatedRow[0] !== 0) return res.status(200).json({
            status: true,
            endAt,
            id
        })

        res.status(400).json({
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

const updatePost = async (req, res) => {
    try {
        const {
            postId,
            data
        } = req.body

        const updatedRow = await Post.update(
            data,
            {
                where: {
                    id: postId
                }
            }
        )

        if (updatedRow[0] !== 0) return res.status(200).json({
            message: 'Cập nhật bài đăng thành công'
        })

        res.status(400).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        });
    }catch(err) {
        res.status(500).json({ message: err });
    }
}

const deletePostById = async (req, res) => {
    try {
        const {
            id
        } = req.body;
        
        const result = await sequelize.transaction(async (t) =>{

            await CvApply.destroy({
                where: {
                    postId: id
                },
                transaction: t
            })

            await PostAddress.destroy({
                where: {
                    postId: id
                },
                transaction: t
            })
            
            const deletedRow = await Post.destroy({
                where: {
                    id
                },
                transaction: t
            })
            console.log('xoa post: ' + deletedRow);
            return deletedRow;
        })

        res.status(200).json({
            deletedRow: result
        })

    }catch(err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

export {
    getAllPostInCurrentMonth,
    createPost,
    getAllPostByCompanyId,
    getAllPost,
    getAllPostPending,
    updateStatusPost,
    getAllPostActive,
    getAllPostActiveWithSearch,
    getPostById,
    changeDatePost,
    updatePost,
    deletePostById
}