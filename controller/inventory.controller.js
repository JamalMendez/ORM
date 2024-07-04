const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { json } = require('sequelize');
const { Readable } = require('stream');
const csv = require('csv-parser');
const Store = require('../model/store.model');
const Employee = require('../model/employee.model');
const Inventory = require('../model/inventory.model');



const getInventory = asyncHandler(async (req, res) => {
  const inventoryEntries = await Inventory.findAll();
  console.log(json(inventoryEntries));
  res.json(inventoryEntries);
});

const getInventoryNom = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const { attribute, value } = req.query;
  const offset = (page - 1) * pageSize;
  const filter = {
    [attribute]: {
      [Op.iLike]: `%${value}%`,
    },
  };
  const inventoryEntries = await Inventory.findAll({
    offset,
    limit: pageSize,
    where: filter
  });
  res.json(inventoryEntries);
});

const getInventoryNum = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const { attribute, operator, value } = req.query;

    const filter = {
      [attribute]: {
        [Op[operator]]: value,
      },
    };
  const inventoryEntries = await Inventory.findAll({
    offset,
    limit: pageSize,
    where: filter
  });
  res.json(inventoryEntries);
});

const getInventoryDate = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const { attribute, operator, value } = req.query;

    const filter = {
      [attribute]: {
        [Op[operator]]: new Date(value),
      },
    };
  const inventoryEntries = await Inventory.findAll({
    offset,
    limit: pageSize,
    where: filter
  });
  res.json(inventoryEntries);
});

const getInventoryBool = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (page - 1) * pageSize;
  const { attribute, value } = req.query;

    const filter = {
      [attribute]: value,
    };
  const inventoryEntries = await Inventory.findAll({
    offset,
    limit: pageSize,
    where: filter
  });
  res.json(inventoryEntries);
});

// POST /INSERT

const postInventory = asyncHandler(async (req, res) => {

  const {
    EmployeeName,
    StoreName,
    Date,
    Flavor,
    IsSeasonFlavor,
    Quantity,
  } = req.body;

  const newEmployeeEntry = await Employee.create({
    name: EmployeeName
  });
  const newStoreEntry = await Store.create({
    name: StoreName
  });
  const newInventoryEntry = await Inventory.create({
    store_id: newStoreEntry.id,
    date: Date,
    flavor: Flavor,
    is_season_flavor: IsSeasonFlavor,
    quantity: Quantity,
    employee_id: newEmployeeEntry.id,
  });

  res.status(201).json({ message: 'Inventory entry created successfully', data: [newInventoryEntry, newEmployeeEntry, newStoreEntry] });
});

// POST /UPLOAD

const uploadInventory = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha proporcionado ningún archivo CSV.' });
  }

  const csvFileBuffer = req.file.buffer.toString('utf8');
  const results = [];
  const stream = Readable.from(csvFileBuffer);

  stream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const row of results) {
          if (row.Store && row.Store.trim() !== '') {
            const newEmployeeEntry = await Employee.create({
              name: row['Listed By'] ? row['Listed By'].trim() : null
            });

            const newStoreEntry = await Store.create({
              name: row.Store.trim()
            });

            const newInventoryEntry = await Inventory.create({
              store_id: newStoreEntry.id,
              date: new Date(row['Date']).getFullYear(),
              flavor: row['Flavor'] ? row['Flavor'].trim() : null,
              is_season_flavor: row['Is Season Flavor'] ? row['Is Season Flavor'].trim() : null,
              quantity: row['Quantity'] ? parseInt(row['Quantity'], 10) : 0,
              employee_id: newEmployeeEntry.id
            });
          }
        }

        res.status(201).json({ message: 'Datos del archivo CSV insertados con éxito.' });
      } catch (error) {
        console.error('Error al procesar el CSV:', error);
        res.status(500).json({ message: 'Error al procesar el archivo CSV.' });
      }
    });
});

// CRUD INDIVIDUAL

const getSelectInventory = asyncHandler(async (req, res) => {
  const inventoryId = req.params.id;

  const inventory = await Inventory.findByPk(inventoryId);

  if (!inventory) {
    return res.status(404).json({ error: 'Inventory not found' });
  }

  return res.json(inventory);
})

const putSelectInventory = asyncHandler(async (req, res) => {
  const inventoryId = req.params.id;

  const updateFields = req.body;

  const inventory = await Inventory.findByPk(inventoryId);

  if (!inventory) {
    return res.status(404).json({ error: 'Inventory not found' });
  }

  await inventory.update(updateFields);

  await inventory.save();

  return res.json({ message: 'Inventory entry updated successfully' });
})

const deleteSelectInventory = asyncHandler(async (req, res) => {
  const inventoryId = req.params.id;

  const inventory = await Inventory.findByPk(inventoryId);

  if (!inventory) {
    return res.status(404).json({ error: 'Inventory not found' });
  }

  try {
    await inventory.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete inventory entry' });
  }
})

module.exports = { getInventoryBool, getInventoryDate, getInventoryNum, getInventoryNom, deleteSelectInventory, putSelectInventory, getSelectInventory, getInventory, postInventory, uploadInventory };
