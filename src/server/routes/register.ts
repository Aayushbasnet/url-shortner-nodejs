const express = require('express');
const router = express.Router();
const path = require('path');

const staticPath = path.join(__dirname, '../public');
router.use(express.static(staticPath));

router.get('/', (req, res) =>{
    // console.log("Path: ",path.join(__dirname, '../public'));
    res.sendFile("register.html", {root: staticPath});
});

export{};
module.exports = router;