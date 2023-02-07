import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Company from "./company";
import User from "./user";

const Rate = sequelize.define('Rate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    star: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT
    },
    companyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'id'
        }
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

export default Rate;