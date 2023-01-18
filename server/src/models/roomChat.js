import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

const RoomChat = sequelize.define('RoomChat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId_1: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    userId_2: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default RoomChat;