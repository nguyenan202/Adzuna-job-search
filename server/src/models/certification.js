import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import CV from './cv';

const Certification = sequelize.define('Certification', {
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
    CVId: {
        type: DataTypes.INTEGER,
        references: {
            model: CV,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default Certification;