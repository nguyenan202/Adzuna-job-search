import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import CV from './cv';

const Experience = sequelize.define('Experience', {
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
    },
    startAt: {
        type: DataTypes.STRING(10)
    },
    endAt: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    CVId: {
        type: DataTypes.INTEGER,
        references: {
            model: CV,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default Experience;