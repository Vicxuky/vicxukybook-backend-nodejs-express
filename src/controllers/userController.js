import userService from "../services/userService";
import jwt from "jsonwebtoken";
//
let refreshTokens = [];

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Email or password not value!!!",
    });
  }

  let userData = await userService.loginSystem(email, password);
  res.cookie("refreshToken", userData.refreshToken, {
    httpOnly: true,
    // secure: true, chỉ dùng khi web load https
    secure: false,
    path: "/",
    sameSite: "strict",
  });
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    accessToken: userData.accessToken,
    // refreshToken: userData.refreshToken,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing...parameters",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleRefreshToken = async (req, res) => {
  // lay refreshToken tu user
  try {
    const refreshToken = req.headers.cookie.replace("refreshToken=", "");
    if (!refreshToken) {
      return res.status(401).json("You are not authenticated!!!");
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("RefreshToken is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = jwt.sign(
        {
          id: user.id,
          roleId: user.roleId,
        },
        process.env.JWT_ACCESS_TOKEN_KEY,
        {
          expiresIn: "60s",
        }
      );

      const newRefreshToken = jwt.sign(
        {
          id: user.id,
          roleId: user.roleId,
        },
        process.env.JWT_REFRESH_TOKEN_KEY,
        {
          expiresIn: "365d",
        }
      );
      // save database
      refreshTokens.push(newAccessToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (e) {
    return res.status(400).json("Not cookies");
  }
};

let handleLogout = async (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter((token) => token !== req.headers.cookie);
  return res.status(200).json("Logged Out...");
};

let handleCreateNewUsers = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  console.log(message);
  return res.status(200).json(message);
};

let handleEditUsers = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let handleDeleteUsers = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUsers,
  handleEditUsers,
  handleDeleteUsers,
  handleRefreshToken,
  handleLogout,
};
