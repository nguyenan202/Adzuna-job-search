import { Op } from "sequelize"
import RoomChat from "../models/roomChat"
import User from "../models/user"
import Company from "../models/company"
import { io } from '../index';


const getRoomChat = async (req, res) => {
    try {
        const {
            userId1,
            userId2
        } = req.body

        const roomChat = await RoomChat.findOne({
            where: {
                [Op.or]: [
                    { userId_1: userId1, userId_2: userId2 },
                    { userId_1: userId2, userId_2: userId1 }
                ]
            }
        })

        if (roomChat) return res.status(200).json(roomChat);

        const roomChatCreate = await RoomChat.create({
            userId_1: userId1,
            userId_2: userId2
        })

        res.status(200).json(roomChatCreate);


    } catch (err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const getRoomChatById = async (req, res) => {
    try {
        const {
            id,
            userId
        } = req.params;
        
        User.hasOne(Company, { foreignKey: 'userId' });
        RoomChat.belongsTo(User, { foreignKey: 'userId_2' });
        const roomChat_1 = await RoomChat.findOne({
            where: {
                id,
                userId_1: userId
            },
            include: [
                {
                    model: User,
                    include: [{
                        model: Company
                    }]
                }
            ]
        });

        RoomChat.belongsTo(User, { foreignKey: 'userId_1' });
        const roomChat_2 = await RoomChat.findOne({
            where: {
                id,
                userId_2: userId
            },
            include: [
                {
                    model: User,
                    include: [{
                        model: Company
                    }]
                }
            ]
        });
        

        if (roomChat_1) return res.status(200).json(roomChat_1)
        if (roomChat_2) return res.status(200).json(roomChat_2)

        res.status(404).json({
            message: 'Không tìm dc phòng chat'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const getAllRoomChatByUserId = async (req, res) => {
    try {
        const {
            userId
        } = req.params

        User.hasOne(Company, { foreignKey: 'userId' });
        RoomChat.belongsTo(User, {foreignKey: 'userId_2' });
        const roomChats_1 = await RoomChat.findAll({
            where: {
                [Op.or]: [
                    { userId_1: userId },
                ]
            },
            include: [
                {
                    model: User,
                    include: [{
                        model: Company
                    }]
                }
            ]
        })

        RoomChat.belongsTo(User, {foreignKey: 'userId_1' });
        const roomChats_2 = await RoomChat.findAll({
            where: {
                [Op.or]: [
                    { userId_2: userId },
                ]
            },
            include: [
                {
                    model: User,
                    include: [{
                        model: Company
                    }]
                }
            ]
        })

        if (roomChats_1 && roomChats_2) return res.status(200).json([...roomChats_1, ...roomChats_2]);

        res.status(404).json({
            message: 'Không tìm thấy'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

export {
    getRoomChat,
    getRoomChatById,
    getAllRoomChatByUserId
}