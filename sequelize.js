require('dotenv').config();

const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.DBNAME, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'postgres',
});

const funcion = async function(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
};
funcion();

module.exports = sequelize;
