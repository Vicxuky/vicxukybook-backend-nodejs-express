import userService from "../services/userService";
import jwt from "jsonwebtoken";

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

  let userData = await userService.handleLogin(email, password);
  res.cookie("refreshToken", userData.refreshToken, {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "strict",
  });
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    token: userData.accessToken,
    // token2: userData.refreshToken,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.body.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing...",
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

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleRefreshToken,
  handleLogout,
};
