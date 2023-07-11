const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const ClothingItem = require("../models/clothingItem");
const ForbibbenError = require("../errors/forbidden");
const BadRequestError = require("../errors/invalidData");
const NotFoundError = require("../errors/notFound");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!name && !weather && !imageUrl) {
    next(new BadRequestError("Missing the required fileds"));
    return;
  }

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(error);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch((error) => {
      next(error);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findOne({ _id: itemId }).then((item) => {
    if (!item) {
      next(new NotFoundError("Clothing item ID cannot be found"));
      return null;
    }
    if (!item?.owner?.equals(userId)) {
      next(new ForbibbenError("Unauthorized: You're not the card owner"));
      return null;
    }
    return ClothingItem.deleteOne({ _id: itemId, owner: userId })
      .then(() => {
        res.send({ message: "Item deleted successfully" });
      })
      .catch((error) => {
        next(error);
      });
  });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      next(error);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
