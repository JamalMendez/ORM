// store.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize configurada

class Store extends Model {}

Store.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Store',
  tableName: 'store', // Puedes definir el nombre de la tabla si es diferente al nombre del modelo
});

const crear = async () =>{
    await Store.sync();
    console.log("comando ejecutado!");
}
crear();

module.exports = Store;
