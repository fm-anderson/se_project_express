const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getUsers, getUser, getCurrentUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.get("/me", auth.handleAuthError, getCurrentUser);

module.exports = router;
