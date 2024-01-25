const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/users' , (req , res) => {
    res.send('Users routes are working properly')
})

// register a user 
router.post('/register', async (req, res) => {
    try {
    const { name, email, password , phone_number , priority } = req.body;

        const user = new User({ name, email, password , phone_number , priority });
        await user.save();
        res.status(201).send({ user, message: "User Created Successfully" });
    }

    catch (err) {
        res.status(400).send({ error: err });
    }

});

// login a user

router.post('/login' , async(req , res) => {
   
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            throw new Error('Unable to login  , user nor found recheck' );
        }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).send('Invalid password');
            }
            //jwrt token
            const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);
            res.send({ user , token , message : " logged in successfully" });

    }
    catch (err) {
        res.status(400).send({error : err});
    }
      
} )






module.exports = router;