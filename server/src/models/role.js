import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    }
})

await sequelize.sync();

export default Role;