const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // console.log(process.env.JWT_SECRET);
  const authHeader = req.headers.token;
  if (authHeader) {
    const authtoken = authHeader.replace('Bearer',' ').trim();
    console.log(authtoken);
    jwt.verify(authtoken, process.env.JWT_SECRET, (err, user) => {

      if(err){
        console.log(err);
      }
      else{
        console.log(user);
      req.user = user;
      console.log(req.user)
      next();
      }
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

// this is middleware for verification

const verifyTokenAndAuthorization = (req, res, next) => {
  console.log("heloo",req.headers.token);
  verifyToken(req, res, () => {
    console.log(req.user.id,' ',req.params.id);

    if (req.user.id === req.params.id || req.user.isAdmin) {
      console.log("prism");
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

// 2023-05-04T18:54:42.916+00:00

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};