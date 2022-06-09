import express from "express";
import homeController from "../controllers/homeCotroller";
import userController from "../controllers/userController";
import productController from "../controllers/productController";
import orderController from "../controllers/orderController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);

  router.post("/post-crud", homeController.postCRUD);

  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);

  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);
  // auth
  router.post("/api/v1/login", userController.handleLogin);
  // router.post("/api/v1/signin", userController.handleSignin);

  // CRUD user
  router.get("/api/v1/get-all-user", userController.handleGetAllUsers);
  router.post("/api/v1/create-new-user", userController.handleCreateNewUser);
  router.put("/api/v1/edit-user", userController.handleEditUser);
  router.delete("/api/v1/delete-user", userController.handleDeleteUser);

  // CRUD product
  router.get("/api/v1/get-all-product", productController.handleGetAllProduct);
  router.post(
    "/api/v1/create-new-product",
    productController.handleCreateNewProduct
  );
  router.delete(
    "/api/v1/delete-product",
    productController.handleDeleteProduct
  );
  router.put("/api/v1/edit-product", productController.handleEditProduct);
  // order
  router.get("/api/v1/get-order", orderController.handleGetALLOrder);
  router.post("/api/v1/post-order", orderController.handlePostOrder);
  router.delete("/api/v1/delete-order", orderController.handleDeleteOrder);

  // refreshToken
  router.post("/api/v1/refresh", userController.handleRefreshToken);
  router.post("/api/v1/logout", userController.handleLogout);

  return app.use("/", router);
};
module.exports = initWebRoutes;
