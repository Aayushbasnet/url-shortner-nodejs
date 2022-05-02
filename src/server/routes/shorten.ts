const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send(`Hi I am going to shorten ${req.body.urlShortner}`);
});

router.post('/', (req,res) => {
    console.log(req.body.urlShortner);
    res.send(`Hi I am shorten ' ${req.body.urlShortner} '`);
});



export{};
module.exports = router;
