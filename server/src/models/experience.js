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
        type: DataTypes.DATEONLY
    },
    endAt: {
        type: DataTypes.DATEONLY,
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