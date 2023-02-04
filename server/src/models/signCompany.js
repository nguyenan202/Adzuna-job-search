import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";

const SignCompany = sequelize.define('SignCompany', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
    url: {
        type: DataTypes.TEXT
    },
    reason: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.INTEGER
    },
    comment: {
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

await SignCompany.sync();

export default SignCompany;