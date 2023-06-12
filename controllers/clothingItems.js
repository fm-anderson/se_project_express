const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/error");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid data provided" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res
        .status(DEFAULT_ERROR.error)
        .send({ message: "An error has occured on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        res.status(NOTFOUND_ERROR.error).send({ message: "Item not found" });
      } else {
        res.send({ data: item });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid item ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        res.status(NOTFOUND_ERROR.error).send({ message: "Item not found" });
      } else {
        res.send({ data: item });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid item ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        res.status(NOTFOUND_ERROR.error).send({ message: "Item not found" });
      } else {
        res.send({ data: item });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR.error)
          .send({ message: "Invalid item ID" });
      } else {
        res
          .status(DEFAULT_ERROR.error)
          .send({ message: "An error has occured on the server" });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
