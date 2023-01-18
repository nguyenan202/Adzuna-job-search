import { Sequelize } from "sequelize";

const sequelize = new Sequelize('adzunadb', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    port: '3306',
    logging: false
});

const connection = async () => {

    await sequelize.authenticate();
    console.log('Connected to Database success');

}

export { sequelize }
export default connection