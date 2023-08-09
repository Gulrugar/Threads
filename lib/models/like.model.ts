import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  liked: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;
