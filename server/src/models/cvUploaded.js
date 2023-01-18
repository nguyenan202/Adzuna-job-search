import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Post from './post';
import User from "./user";

const CvUploaded = sequelize.define('CvUploaded', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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

export default CvUploaded;