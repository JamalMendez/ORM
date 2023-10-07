// employee.model.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize configurada

class Employee extends Model {}

Employee.init({
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
  modelName: 'Employee',
  tableName: 'employee', // Puedes definir el nombre de la tabla si es diferente al nombre del modelo
});
const crear = async () =>{
    await Employee.sync();
    console.log("comando ejecutado!");
}
crear();

module.exports = Employee;
