const express = require('express');
const router = express.Router();
const path = require('path');

const staticPath: string = path.join(__dirname, '../public');
router.use(express.static(staticPath));
console.log(staticPath);

router.get('/', (req, res) =>{
    res.sendFile("login.html", {root: staticPath});
})

export{}
module.exports = router;
