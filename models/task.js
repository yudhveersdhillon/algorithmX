const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true, 
          },
        description: {
            type: String,
        },
        statusTask: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
          },
          status: {
            type: Number,
            default: 1, 
            index: true,
          },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);



module.exports = mongoose.model("Task", taskSchema);
