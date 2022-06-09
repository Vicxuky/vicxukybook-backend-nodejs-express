import db from "../models/index";

let getAllOrders = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = "";
      if (orderId === "ALL") {
        orders = await db.Order.findAll();
      }
      if (orderId && orderId !== "ALL") {
        orders = await db.Order.findOne({
          where: { id: orderId },
        });
      }
      resolve(orders);
    } catch (e) {
      reject(e);
    }
  });
};

let postOrder = async (data) => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      await db.Order.create({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        status: data.status,
        note: data.note,
      });
      resolve({
        errCode: 0,
        errMessage: "Post order succeed!!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    let order = await db.Order.findOne({
      where: { id: orderId },
    });
    if (!order) {
      resolve({
        errCode: 2,
        errMessage: "Order is not exist",
      });
    } else {
      await db.Order.destroy({
        where: { id: orderId },
      });
      resolve({
        errCode: 0,
        errMessage: "Delete a order succeed!",
      });
    }
  });
};

module.exports = { getAllOrders, postOrder, deleteOrder };
