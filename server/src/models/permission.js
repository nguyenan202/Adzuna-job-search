import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    path: {
        type: DataTypes.STRING
    }
})

await sequelize.sync();

export default Permission;