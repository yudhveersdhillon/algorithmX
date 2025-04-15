const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var secretKey ="iAmAlgorithmEncrypt_&&^^(())";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        status: {
            type: Number,
            default: 1, // or CONFIG.ACTIVE_STATUS
            index: true,
          },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

userSchema.methods.setPassword = async function (password) {
    return new Promise(async function (resolve, reject) {
        // generate a salt
        bcrypt.genSalt(parseInt(secretKey)).then((salt) => {
            // hash the password using our new salt
            bcrypt.hash(password, salt).then((hash) => {
                resolve(hash);
            });
        });
    });
};

userSchema.methods.comparePassword = async function (bodyPass) {
    let pass = await bcrypt.compare(bodyPass, this.password);
    return pass;
};

module.exports = mongoose.model("User", userSchema);
