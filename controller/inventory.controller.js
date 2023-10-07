const asyncHandler = require('express-async-handler');
const { json } = require('sequelize');
const { Readable } = require('stream'); 
const csv = require('csv-parser');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Store = require('../model/store.model');
const Employee = require('../model/employee.model');
const Inventory = require('../model/inventory.model');



const getInventory = asyncHandler(async (req, res) => {
    const inventoryEntries = await Inventory.findAll();
    console.log(json(inventoryEntries));
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
        name:  EmployeeName
    });
    const newStoreEntry = await Store.create({
        name:  StoreName
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
        for (const row of results) {
            if(row.Store != ''){
                const newEmployeeEntry = await Employee.create({
                    name:  row[' Listed By']
                });
                const newStoreEntry = await Store.create({
                    name:  row.Store
                });
                const newInventoryEntry = await Inventory.create({
                    store_id: newStoreEntry.id,
                    date: new Date(row[' Date']).getFullYear(),
                    flavor: row[' Flavor'],
                    is_season_flavor: row[' Is Season Flavor'],
                    quantity: row[' Quantity'],
                    employee_id: newEmployeeEntry.id, 
                });
            }
        }

        res.status(201).json({ message: 'Datos del archivo CSV insertados con éxito.' });
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

module.exports = {deleteSelectInventory, putSelectInventory, getSelectInventory, getInventory, postInventory, uploadInventory};
