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

module.exports = {
  getAllProduct,
};
