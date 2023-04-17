import Message from '../models/message';
import { io } from '../index';
import RoomChat from '../models/roomChat';
import { sequelize } from '../config/database';

const getAllMessage = async (req, res) => {
    try {
        const {
            id
        } = req.params

        const allMessage = await Message.findAll({
            where: {
                roomChatId: id
            }
        })

        if (allMessage) return res.status(200).json(allMessage);

        res.status(400).json({
            message: 'Có lỗi'
        })
    }catch(err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

const addMessage = async (req, res) => {
    try {
        const {
            text,
            userId,
            roomChatId
        } = req.body

        const result = await sequelize.transaction(async (t) => {
            const createdMessage = await Message.create({
                text,
                userId,
                roomChatId
            },{
                transaction: t
            });

            const roomChat = await RoomChat.findOne({
                where: {
                    id: roomChatId
                },
                transaction: t
            });

            const userReciveMessage = roomChat.userId_1 === userId ? roomChat.userId_2 : roomChat.userId_1;

            if (createdMessage && userReciveMessage) {
                io.emit(`update-chatRoom-${roomChatId}`, createdMessage);
                io.emit(`update-boxchat-${userReciveMessage}`);
                return {
                    status: 200,
                    data: createdMessage
                }
            }

            return {
                status: 400,
                data: {
                    message: 'Có lỗi, vui lòng thử lại sau'
                }
            }
        });


        res.status(result.status).json(result.data);
    }catch(err) {
        res.status(500).json({
            message: 'Có lỗi, vui lòng thử lại sau'
        })
    }
}

export {
    getAllMessage,
    addMessage
}