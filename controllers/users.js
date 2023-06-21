const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  DEFAULT_ERROR,
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/error");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!password) {
    res
      .status(UNAUTHORIZED_ERROR.error)
      .send({ message: "Password is required" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.send({ name, avatar, _id: user._id, email: user.email });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid data provided" });
      } else if (error.code === 11000) {
        res
          .status(CONFLICT_ERROR.error)
          .send({ message: "Email already exists in database" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED_ERROR.error)
          .send({ message: "Email or Password not found" });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          res
            .status(UNAUTHORIZED_ERROR.error)
            .send({ message: "Email or Password not found" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      });
    })
    .catch(() => {
      res
        .status(UNAUTHORIZED_ERROR.error)
        .send({ message: "Email or Password not found" });
    });
};

const getCurrentUser = (req, res) => {
  const { _id: userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      }

      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid data provided" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occured on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOTFOUND_ERROR.error).send({ message: "User not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid user ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  login,
  getCurrentUser,
  updateUser,
};
