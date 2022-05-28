import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDservice.createNewUser(req.body);
  console.log(message);
  return res.send("post CRUD User");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDservice.getAllUser();

  console.log(data);
  return res.render("displayCRUD.ejs", {
    data: data,
  });
};

let getEditCRUD = async (req, res) => {
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDservice.getUserInfoById(userId);
    //check user

    return res.render("editCRUD.ejs", {
      user: userData,
    });
  } else {
    return res.send("user NotFound");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUser = await CRUDservice.updateUserData(data);
  return res.render("displayCRUD.ejs", {
    data: allUser,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDservice.deleteUserById(id);
    return res.send("Delele Succeed!!!");
  } else {
    return res.send("Do not User...");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
