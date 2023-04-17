import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Role from './role'

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    picturePath: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        defaultValue: 'no_image.png'
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    dob: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    externalId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    externalType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    roleId: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        references: {
            model: Role,
            key: 'id'
        }
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1
    }
})

await sequelize.sync(); //Wait to create Table in Database if they do not exist

export default User;