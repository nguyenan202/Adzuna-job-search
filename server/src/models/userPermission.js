import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import User from "./user";
import Permission from "./permission";

const UserPermission = sequelize.define('UserPermission', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    permissionId: {
        type: DataTypes.INTEGER,
        references: {
            model: Permission,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default UserPermission;