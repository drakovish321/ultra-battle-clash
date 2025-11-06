const express = require('express');
const router = express.Router();
const { pool } = require('../models/db');

router.get('/', async (req,res)=>{
    const result = await pool.query('SELECT username,wins FROM users ORDER BY wins DESC LIMIT 10');
    res.json(result.rows);
});

module.exports = router;
