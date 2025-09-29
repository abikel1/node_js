const express = require('express');
const router=express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Express work 6666' })
})

module.exports = router;