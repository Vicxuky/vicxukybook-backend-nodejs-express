import db from "../models/index";

let getAllProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = "";
      if (productId === "ALL") {
        products = await db.Product.findAll();
      }
      if (productId && productId !== "ALL") {
        products = await db.Product.findOne({
          where: { id: productId },
        });
      }
      resolve(products);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewProduct = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Product.create({
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        priceOld: data.priceOld,
        priceNew: data.priceNew,
        desc: data.desc,
        image: data.image,
        categoryId: data.categoryId,
      });
      resolve({
        errCode: 0,
        errMessage: "Create new product succeed!!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    let product = await db.Product.findOne({
      where: { id: productId },
    });
    if (!product) {
      resolve({
        errCode: 2,
        errMessage: "Product is not exist",
      });
    } else {
      await db.Product.destroy({
        where: { id: productId },
      });
      resolve({
        errCode: 0,
        errMessage: "Delete a product succeed!",
      });
    }
  });
};

let updateProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let product = await db.Product.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (product) {
        // raw sequelize
        product.title = data.title;
        product.author = data.author;
        product.publisher = data.publisher;
        product.priceOld = data.priceOld;
        product.priceNew = data.priceNew;
        product.desc = data.desc;
        product.image = data.image;
        product.categoryId = data.categoryId;

        await product.save();
        resolve({
          errCode: 0,
          errMessage: "Update the succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Product not found!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAllProduct,
  createNewProduct,
  deleteProduct,
  updateProduct,
};
