import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

const CV = sequelize.define('CV', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    position: {
        type: DataTypes.STRING,
        allowNull: true
    },
    overView: {
        type: DataTypes.TEXT,
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
        type: DataTypes.STRING(20),
        allowNull: true
    },
    dob: {
        type: DataTypes.STRING(20),
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