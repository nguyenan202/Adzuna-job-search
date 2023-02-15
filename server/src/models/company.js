import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";
import Priority from './priority';

const Company = sequelize.define('Conpany',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    picturePath: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING(2000)
    },
    size: {
        type: DataTypes.INTEGER
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    url: {
        type: DataTypes.TEXT,
    },
    priorityId: {
        type: DataTypes.INTEGER,
        references: {
            model: Priority,
            key: 'id'
        },
        defaultValue: 1
    }
})

await sequelize.sync()

export default Company;