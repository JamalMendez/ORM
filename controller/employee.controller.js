const Employee = require('../model/employee.model');
const cache = require('memory-cache');
const asyncHandler = require('express-async-handler');


const getEmployeeNom = asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    const employeeEntries = await Employee.findAll({
        offset,
        limit: pageSize,
    });
    res.json(employeeEntries);
});

function cacheMiddleware(req, res, next) {
    const key = req.originalUrl; // Utiliza la URL como clave de caché
  
    const cachedData = cache.get(key);
  
    if (cachedData) {
      // Si los datos están en caché, devuelve la respuesta en caché
      return res.json(cachedData);
    }
  
    // Si los datos no están en caché, continua con la solicitud y guarda los datos en caché
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, 60000); // Guarda en caché durante 1 minuto (ajusta el tiempo según tus necesidades)
      res.sendResponse(body);
    };
  
    next();
  }

module.exports = {getEmployeeNom, cacheMiddleware};