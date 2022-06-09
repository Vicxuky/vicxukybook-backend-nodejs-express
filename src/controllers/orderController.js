import orderService from "../services/orderService";

let handleGetALLOrder = async (req, res) => {
  let id = req.query.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing...",
      orders: [],
    });
  }
  let orders = await orderService.getAllOrders(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    orders,
  });
};

let handlePostOrder = async (req, res) => {
  let message = await orderService.postOrder(req.body);
  return res.status(200).json(message);
};

let handleDeleteOrder = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await orderService.deleteOrder(req.body.id);
  return res.status(200).json(message);
};

module.exports = { handleGetALLOrder, handlePostOrder, handleDeleteOrder };
