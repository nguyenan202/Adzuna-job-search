import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Job from './job';

const Specialization = sequelize.define('Specialization', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    jobId: {
        type: DataTypes.INTEGER,
        references: {
            model: Job,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default Specialization;