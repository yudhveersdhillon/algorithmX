const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "yourSecretKey"; 
exports.verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};
