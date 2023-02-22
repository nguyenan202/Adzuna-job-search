import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import CV from './cv';

const Skill = sequelize.define('Skill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
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

export default Skill;