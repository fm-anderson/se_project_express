const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { NotFoundError } = require("../errors/notFound");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUser, validateAuth } = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", auth.handleAuthError, user);
router.post("/signup", validateUser, createUser);
router.post("/signin", validateAuth, login);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
