import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Role from "./role";

const SettingPermission = sequelize.define('SettingPermission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default SettingPermission;