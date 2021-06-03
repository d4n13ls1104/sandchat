var express = require('express');
const path = require("path");
var router = express.Router();

/* GET home page. */
router.get('*', (req, res , next) => {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

module.exports = router;