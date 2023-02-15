import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Specialization from './specialization';
import Company from './company';
import WorkingTime from './workingTime';
import Level from './level';
import ExperiencePost from './experiencePost';

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
        type: DataTypes.INTEGER
    },
    quantity: {
        type: DataTypes.INTEGER
    },
    workingTimeId: {
        type: DataTypes.INTEGER,
        references: {
            model: WorkingTime,
            key: 'id'
        }
    },
    levelId: {
        type: DataTypes.INTEGER,
        references: {
            model: Level,
            key: 'id'
        }
    },
    gender: {
        /**
         * 0: Male
         * 1: Female
         * 2: Other
         */
        type: DataTypes.TINYINT
    },
    experiencePostId: {
        type: DataTypes.INTEGER,
        references: {
            model: ExperiencePost,
            key: 'id'
        }
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
    },
    status: {
        /**
         *  0: pending
         *  1: resolve
         *  2: reject
         */
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    reason: {
        type: DataTypes.TEXT,
        defaultValue: null
    }
})

await sequelize.sync();

export default Post;