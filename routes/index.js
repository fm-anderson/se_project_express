const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NOTFOUND_ERROR } = require("../utils/error");
const { createUser, login } = require("../controllers/users");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(NOTFOUND_ERROR.error).send({ message: "Router not found" });
});

module.exports = router;
