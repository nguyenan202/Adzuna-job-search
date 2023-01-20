import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Post from './post';
import Address from './address';

const PostAddress = sequelize.define('PostAddress', {
    postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Post,
            key: 'id'
        }
    },
    addressId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Address,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default PostAddress;