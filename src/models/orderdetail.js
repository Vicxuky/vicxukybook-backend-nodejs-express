"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orderdetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Orderdetail.init(
    {
      price: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      sumMoney: DataTypes.INTEGER,
      orderId: DataTypes.STRING,
      productId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Orderdetail",
    }
  );
  return Orderdetail;
};
