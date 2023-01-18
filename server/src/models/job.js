import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Job = sequelize.define('Job', {
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

export default Job;