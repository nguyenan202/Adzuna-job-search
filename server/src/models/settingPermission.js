import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const SettingPermission = sequelize.define('SettingPermission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT
    }
})

await sequelize.sync();

export default SettingPermission;