import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Post from './post';
import User from "./user";
import CV from "./cv";

const CvApply = sequelize.define('CvApply', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CVId: {
        type: DataTypes.INTEGER,
        references: {
            model: CV,
            key: 'id'
        }
    },
    picturePath: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        /**
         * 1: Pending
         * 0: Rejected
         * 2: Accepted
         */
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
    comment: {
        //for Admin
        type: DataTypes.TEXT,
        allowNull: true
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
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

export default CvApply;