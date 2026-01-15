const express = require('express');
const router = express.Router();

//Import Controller
const {submitQuery} = require("../controllers/ContactController");

//Routes For Contact Us
router.post("/submitQuery",submitQuery);

module.exports = router;