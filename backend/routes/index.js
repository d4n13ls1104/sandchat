const express = require('express');
const path = require("path");
const auth = require("../middleware/sand-auth");

const router = express.Router();

/* GET home page. */
router.get('*', auth, (req, res) => {
  if((req.baseUrl + req.path) === "/login" && req.cookies.auth) return res.redirect("/home");
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

module.exports = router;
