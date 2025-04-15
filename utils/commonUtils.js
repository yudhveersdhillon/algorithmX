var passwordValidator = require("password-validator");
var mongoose = require("mongoose");
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(pass) {
  var schema = new passwordValidator();
  schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(["Password", "Password123"]);

  //disabled this to fit flutter app validation
  //.has().uppercase() // Must have uppercase letters
  //.has().lowercase() // Must have lowercase letters

  if (!schema.validate(pass)) return false;
  else return true;
}

function toObjectId(id) {
  return mongoose.Types.ObjectId(id);
}

function idValidObjectId(id) {
  const ObjectId = mongoose.Types.ObjectId;
  return ObjectId.isValid(id) ? true : false;
}


module.exports = {
  isValidEmail,
  isValidPassword,
  toObjectId,
  idValidObjectId  
};
