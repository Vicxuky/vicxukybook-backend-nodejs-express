import productService from "../services/productService";

let handleGetAllProduct = async (req, res) => {
  let id = req.query.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing...",
      products: [],
    });
  }
  let products = await productService.getAllProduct(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    products,
  });
};

let handleCreateNewProduct = async (req, res) => {
  let message = await productService.createNewProduct(req.body);
  return res.status(200).json(message);
};

let handleEditProduct = async (req, res) => {
  let data = req.body;
  let message = await productService.updateProduct(data);
  return res.status(200).json(message);
};

let handleDeleteProduct = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await productService.deleteProduct(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  handleGetAllProduct,
  handleCreateNewProduct,
  handleDeleteProduct,
  handleEditProduct,
};
