import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: { type: String },
  username: { type: String},
  email: { type: String, required: true },
  password: { type: String, required: true }
});

var User =  mongoose.model("User", userSchema);

export default User;