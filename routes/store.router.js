const express = require('express');
const store = require('../controller/store.controller');

const router = express.Router();

/* GET home page. */
router.use(express.urlencoded({
  extended : true
}));
router.use(express.json());

router.use('/', store.cacheMiddleware);

router.get('/', store.getStoresNom);

module.exports = router;