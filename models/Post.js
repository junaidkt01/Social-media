const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;
// console.log("ObjectId", ObjectId);

const postSchema = new Schema({
  title: { type: String, require: true },
  body: { type: String, require: true },
  photo: { type: String, require: true },
  comment: [
    { text: String, name: String, postedby: { type: ObjectId, ref: "User" } },
  ],
  likes: [{ type: ObjectId, ref: "User" }],
  postedby: { type: ObjectId, ref: "User" },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
