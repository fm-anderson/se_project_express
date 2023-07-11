const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateProfileAvatar } = require("../middlewares/validation");

router.get("/me", auth.handleAuthError, getCurrentUser);

router.patch("/me", auth.handleAuthError, validateProfileAvatar, updateUser);

module.exports = router;
