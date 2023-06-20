const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.get("/me", auth.handleAuthError, getCurrentUser);

router.patch("/me", auth.handleAuthError, updateUser);

module.exports = router;
