const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../models/db');

router.post('/login', async (req,res)=>{
    const {username,password} = req.body;
    let user = await pool.query('SELECT * FROM users WHERE username=$1',[username]);
    if(user.rows.length===0){
        const hash = await bcrypt.hash(password,10);
        await pool.query('INSERT INTO users(username,password_hash) VALUES($1,$2)',[username,hash]);
        return res.json({success:true,message:'User created'});
    }
    const match = await bcrypt.compare(password,user.rows[0].password_hash);
    if(match) return res.json({success:true,message:'Logged in'});
    return res.json({success:false,message:'Wrong password'});
});

module.exports = router;
