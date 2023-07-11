const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", auth.handleAuthError, getCurrentUser);

router.patch("/me", auth.handleAuthError, updateUser);

module.exports = router;
