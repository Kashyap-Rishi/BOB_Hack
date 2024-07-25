const express = require("express");
const {addData} = require("../../controller/dataController");

const router = express.Router();

router.post("/create-rules", addData);

module.exports = router;