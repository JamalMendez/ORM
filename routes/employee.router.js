const express = require('express');
const Employee = require('../controller/employee.controller');

const router = express.Router();

/* GET home page. */
router.use(express.urlencoded({
  extended : true
}));
router.use(express.json());

router.use('/', Employee.cacheMiddleware);

router.get('/', Employee.getEmployeeNom);

module.exports = router;