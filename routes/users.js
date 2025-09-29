const express = require('express');
const bcrypt = require('bcrypt');
const { UserModel, validUser, validLogin, createToken } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { auth } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    res.json({ msg: 'Users work' });
});

router.post('/', async (req, res) => {
    const validBody = validUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = '******';
        res.status(201).json(user);
    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(400)
                .json({ msg: 'Email already in system, try log in', code: 11000 });
        }
        console.log(err);
        res.status(500).json({ msg: 'err', err });
    }
});

router.post("/login", async (req, res) => {
    let validBody = validLogin(req.body);

    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        // קודם כל לבדוק אם המייל נמצא במערכת
        let user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({
                msg: "Password or email is worng ,code:1"
            });
        }

        // בודק אם הסיסמה נכונה באמצעות השוואה מוצפנת
        let authPassword = await bcrypt.compare(req.body.password, user.password);

        if (!authPassword) {
            return res.status(401).json({
                msg: "Password or email is worng ,code:2"
            });
        }

        // יוצר טוקן למשתמש שהתחבר בהצלחה
        let newToken = createToken(user._id);
        res.json({ token: newToken });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err" });
    }
});

router.get('/myEmail', auth, async (req, res) => {
  try {
    const user = await UserModel
      .findById(req.tokenData.id)
      .select('email -_id');   
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);           
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'err', err });
  }
});


router.get("/myInfo", auth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.tokenData.id, { password: 0 }); // <<< id
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});


module.exports = router; 
