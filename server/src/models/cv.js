import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

const CV = sequelize.define('CV', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    picturePath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gender: {
        /**
         * 0: Male
         * 1: Female
         * 2: Other
         */
        type: DataTypes.TINYINT,
        allowNull: true
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
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

export default CV;