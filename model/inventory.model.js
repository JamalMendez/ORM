// inventory.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize configurada
const Store = require('./store.model'); // Importa el modelo Store
const Employee = require('./employee.model'); // Importa el modelo Employee

class Inventory extends Model {}

Inventory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Store, // Referencia al modelo Store
      key: 'id', // Clave primaria en el modelo Store
    },
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee, // Referencia al modelo Employee
      key: 'id', // Clave primaria en el modelo Employee
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  flavor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_season_flavor: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Inventory',
  tableName: 'inventory', // Puedes definir el nombre de la tabla si es diferente al nombre del modelo
});

const crear = async () =>{
    await Inventory.sync();
    console.log("comando ejecutado!");
}
crear();

module.exports = Inventory;
