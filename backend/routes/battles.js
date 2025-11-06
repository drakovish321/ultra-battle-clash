const express = require('express');
const router = express.Router();
const { pool } = require('../models/db');

// Dummy endpoint
router.post('/move', async (req,res)=>{
    // Update battle result logic here
    res.json({win: Math.random()>0.5});
});

module.exports = router;
