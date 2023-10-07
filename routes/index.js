const express = require('express');
const multer = require('multer');
const upload = multer();
const inventory = require('../controller/inventory.controller');

const router = express.Router();

/* GET home page. */
router.use(express.urlencoded({
  extended : true
}));
router.use(express.json());

router.get('/', inventory.getInventory);
router.post('/', inventory.postInventory);
router.post('/upload', upload.single('csvFile'), inventory.uploadInventory);
router.get('/:id', inventory.getSelectInventory);
router.put('/:id', inventory.putSelectInventory);
router.delete('/:id', inventory.deleteSelectInventory);

module.exports = router;
