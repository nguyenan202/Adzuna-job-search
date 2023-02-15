import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

const ExperiencePost = sequelize.define('ExperiencePost', {
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

export default ExperiencePost;