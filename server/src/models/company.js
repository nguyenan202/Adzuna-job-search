import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

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
    star: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
})

await sequelize.sync()

export default Company;