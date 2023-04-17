import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

const Traffic = sequelize.define('Traffic',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default Traffic;