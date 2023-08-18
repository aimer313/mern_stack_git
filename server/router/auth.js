const express = require("express");
// backend router
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

require("../database/db");
const User = require("../models/userSchema");
router.get("/", (req, res) => {
  res.send(`Hello world from server `);
});

// user will send his data  -> By Promises
// router.post('/register' , (req , res) => {
//     // console.log(req.body)

//     //onj destructuring

//     const {name , email , phone , work , password , cpassword} = req.body
//     // console.log(name)
//     // console.log(email)
//     // // res.json( {message : req.body} )
//     // res.send('My resigter page')

//     // validation
//     if(!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({"error" : "Fill All Correct data"})
//     }

//     User.findOne({email : email} )
//     .then((userExist) =>{
//         if(userExist) {
//             return res.status(422).json({"error" : "Email Already Exist"})
//         }

//         const user = new User({name , email , phone , work , password , cpassword})

//         user.save().then(() => {
//             res.status(201).json({message : "user registered succesfuly"})
//         }).catch((err) => res.send(500).json({"error" : "Failed to Register"}))
//     }).catch((err)=>{ console.log(err) })

// })

// user will send his data  -> By Asyn Await

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  // validation
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Fill All Correct data" });
  }

  try {
    // where there is promise we use await (waiting for response)
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email Already Exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password is not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      // save merthod se phle password ko hash
      const userRegister = await user.save();

      if (userRegister) {
        res.status(201).json({ message: "user registered succesfuly" });
      } else {
        // not compulsory
        res.send(500).json({ error: "Failed to Register" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// login route

router.post("/signin", async (req, res) => {
    let token;
  console.log(req.body);
  // res.json({message : "awesome"})

  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ error: "Plz Fill the data" });
    }
    // crud op return promise
    const userLogin = await User.findOne({ email: email });

    // password matcing
    if (userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password);
        
        token = await userLogin.generateAuthToken();
        console.log(token)

        res.cookie("jwtoken" , token , {
            expires : new Date(Date.now() + 25892000000), // cookie expires after 30 days
            httpOnly : true
        })
        if (!isMatch) {
            res.status(400).json({ error: "Invalid Crendetails pass" });
        }else {
            res.json({ message: "User Signin Successfully" });
          }
    } else {
        res.status(400).json({ error: "Invalid Crendetails or User Not Registered" });
    }
    
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
