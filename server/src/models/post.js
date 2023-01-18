import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Specialization from './specialization';
import Company from './company';

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(500)
    },
    specializationId: {
        type: DataTypes.INTEGER,
        references: {
            model: Specialization,
            key: 'id'
        }
    },
    startAt: {
        type: DataTypes.DATEONLY
    },
    endAt: {
        type: DataTypes.DATEONLY
    },
    salary: {
        type: DataTypes.STRING
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    workingTime: {
        type: DataTypes.STRING
    },
    level: {
        type: DataTypes.STRING
    },
    gender: {
        /**
         * 0: Male
         * 1: Female
         * 2: Other
         */
        type: DataTypes.TINYINT
    },
    experience: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    requirments: {
        type: DataTypes.TEXT
    },
    benefits: {
        type: DataTypes.TEXT
    },
    companyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default Post;