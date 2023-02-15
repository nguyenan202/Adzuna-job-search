import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import SettingPermission from "./settingPermission";
import Role from './role';

const UserSettingPermission = sequelize.define('UserSettingPermission', {
    settingPermissionId: {
        type: DataTypes.INTEGER,
        references: {
            model: SettingPermission,
            key: 'id'
        }
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

export default UserSettingPermission;