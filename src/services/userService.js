import db from "../models/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let handleLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email: email },
          // return object
          raw: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK!!!";
            delete user.password;
            userData.user = user;
            //login succeedToken
            userData.accessToken = jwt.sign(
              {
                id: user.id,
                roleId: user.roleId,
              },
              process.env.JWT_ACCESS_TOKEN_KEY,
              {
                expiresIn: "60s",
              }
            );
            //login refreshToken
            userData.refreshToken = jwt.sign(
              {
                id: user.id,
                roleId: user.roleId,
              },
              process.env.JWT_REFRESH_TOKEN_KEY,
              {
                expiresIn: "365d",
              }
            );
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 1;
          userData.errMessage = "User undefined!!!";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Email does not exist in the system.";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleLogin,
  getAllUsers,
};
