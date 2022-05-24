"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Galery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Galery.init(
    {
      productId: DataTypes.STRING,
      thumnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Galery",
    }
  );
  return Galery;
};
