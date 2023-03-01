import Message from '../models/message';
import { io } from '../index';

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

        const createdMessage = await Message.create({
            text,
            userId,
            roomChatId
        })

        if (createdMessage) {
            io.emit(`update-chatRoom-${roomChatId}`, createdMessage);
            return res.status(200).json(createdMessage);
        }
        res.status(400).json({
            message: 'Có lỗi'
        })
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