import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Priority = sequelize.define('Priority', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    limitPost: {
        type: DataTypes.INTEGER
    }
})

await sequelize.sync();

export default Priority;