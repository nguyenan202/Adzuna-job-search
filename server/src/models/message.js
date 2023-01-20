import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";
import RoomChat from './roomChat'

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.TEXT
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    roomChatId: {
        type: DataTypes.INTEGER,
        references: {
            model: RoomChat,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default Message;