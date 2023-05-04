const router = require("express").Router();
const User=require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      //  password:req.body.password,
      password:CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SECRET).toString(),
    });
   
    try {
        // console.log("hello");
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } 
    catch(err){
      console.log(err);
      res.status(500).json(err);
     }
  });


  // LOGIN 
  router.post("/login",async(req,res)=>{
    try{
     const user =  await User.findOne({username: req.body.username})
     // logic(no user)
     !user && res.status(401).json("Wrong credentials!")

     // decrypt the password
     const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.PASS_SECRET);

     const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
     
     const inputPassword=req.body.password;
     originalPassword !== inputPassword && res.status(401).json("Wrong credentials!");

      // jwt
      const accessToken = jwt.sign(
        {
        id:user._id,
        isAdmin:user.isAdmin,
      },
      process.env.JWT_SECRET,
      {expiresIn:"10d"}
      );

     // if after login we get all the detail in that we also have password so we don't want that so we will send rest data leaving password
     // why user._doc (bcz mongodb store our document inside _doc and we are passing our user directly)

     const { password, ...others}=user._doc;


    //  res.status(200).json(others);
    // res.status(200).json({others,accessToken});
    // to prevent other from coming
    res.status(200).json({...others,accessToken});

    }catch(err){
      res.status(500).json(err);
    }
  })

module.exports = router;