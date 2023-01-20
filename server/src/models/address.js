import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Company from './company';

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(500)
    },
    companyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Company,
            key: 'id'
        }
    }
})

await sequelize.sync();

export default Address;