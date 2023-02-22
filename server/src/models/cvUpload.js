import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

const cvUpload = sequelize.define('cvUpload', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: truev
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

export default cvUpload;