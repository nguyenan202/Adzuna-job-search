import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const Level = sequelize.define('Level', {
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

export default Level;