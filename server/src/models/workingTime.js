import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const WorkingTime = sequelize.define('WorkingTime', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    }
})

await sequelize.sync();

export default WorkingTime;