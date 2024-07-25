const express = require("express");
const auditRoutes = require("./rules/auditRoutes");


const router = express.Router();

router.use("/api/audit",  auditRoutes);

module.exports = router;