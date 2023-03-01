import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

const CvUpload = sequelize.define('CvUpload', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    picturePath: {
        type: DataTypes.TEXT
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

export default CvUpload;