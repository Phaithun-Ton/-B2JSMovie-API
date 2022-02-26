require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const followRoute = require("./routes/follerRoute");
const tagNameRoute = require("./routes/tagNameRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const likeRoute = require("./routes/likeRoute");
const postTagNameRoute = require("./routes/postTagNameRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/static", express.static("public/images"));

app.use("/users", userRoute);
app.use("/follows", followRoute);
app.use("/tag-names", tagNameRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);
app.use("/likes", likeRoute);
app.use("/post-tag-names", postTagNameRoute);

app.use((req, res) => [
  res.status(404).json("Resource not found on this server"),
]);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`server running on port ${port}`));
