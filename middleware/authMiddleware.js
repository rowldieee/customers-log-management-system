
import { User } from "../models/userModel.js";

// Verify that the user is logged in and has a valid account.
export const requirePageStaff = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const user = await User.findByPk(req.session.userId);

    if (!user) {
      req.session.destroy(() => {});
      return res.redirect("/login");
    }

    if (!["admin", "staff"].includes(user.role)) {
      return res.status(403).send("Access denied. Staff access required.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Protect API routes from unauthorized users.
export const requireApiStaff = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Please log in first."
      });
    }

    const user = await User.findByPk(req.session.userId);

    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({
        success: false,
        message: "Invalid session. Please log in again."
      });
    }

    if (!["admin", "staff"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Staff access required."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
