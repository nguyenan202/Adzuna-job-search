import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Post from './post';
import Address from './address';

const PostAddress = sequelize.define('PostAddress', {
    postId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    addressId: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
})

await sequelize.sync();

export default PostAddress;