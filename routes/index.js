
  /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import express from "express";
import {
  requirePageStaff,
  requireApiStaff
} from "../middleware/authMiddleware.js";
import { customerController } from "../controllers/customerController.js";
import { customerLogController } from "../controllers/customerLogController.js";
import { homePage } from "../controllers/homeController.js";
const router = express.Router();
router.get("/", homePage);

import { loginPage, registerPage, forgotPasswordPage, dashboardPage, loginUser, registerUser, logoutUser } from "../controllers/authController.js";

router.get("/login", loginPage);
router.post("/login", loginUser);
router.get("/register", registerPage);
router.post("/register", registerUser);
router.get("/forgot-password", forgotPasswordPage);
router.get("/dashboard", dashboardPage);
// Customers Page
router.get("/customers", requirePageStaff, (req, res) => {
  res.render("customers", {
    title: "Customers"
  });
});

// Customer Logs Page
router.get("/customer-logs", requirePageStaff, (req, res) => {
  res.render("customer-logs", {
    title: "Customer Logs"
  });
});

router.get("/logout", logoutUser);



// Customer Logs API Routes

router.get(
  "/api/customer-logs",
  requireApiStaff,
  customerLogController.index
);

router.get(
  "/api/customers/:customerId/logs",
  requireApiStaff,
  customerLogController.getByCustomer
);

router.post(
  "/api/customer-logs",
  requireApiStaff,
  customerLogController.store
);

router.patch(
  "/api/customer-logs/:id/status",
  requireApiStaff,
  customerLogController.updateStatus
);

// Customer Management API Routes

router.get(
  "/api/customers",
  requireApiStaff,
  customerController.index
);

router.post(
  "/api/customers",
  requireApiStaff,
  customerController.store
);

router.get(
  "/api/customers/:id",
  requireApiStaff,
  customerController.show
);

router.put(
  "/api/customers/:id",
  requireApiStaff,
  customerController.update
);

router.patch(
  "/api/customers/:id/archive",
  requireApiStaff,
  customerController.archive
);


 // Orders API Routes
router.get("/api/orders", requireApiStaff, orderController.index);
router.post("/api/orders", requireApiStaff, orderController.store);
router.get("/api/orders/:id", requireApiStaff, orderController.show);
router.put("/api/orders/:id", requireApiStaff, orderController.update);

// Water Activities API Routes
router.get("/api/water-activities", requireApiStaff, waterActivityController.index);
router.post("/api/water-activities", requireApiStaff, waterActivityController.store);
router.get("/api/water-activities/:id", requireApiStaff, waterActivityController.show);
router.put("/api/water-activities/:id", requireApiStaff, waterActivityController.update);

// Feedback API Routes
router.get("/api/feedbacks", requireApiStaff, feedbackController.index);
router.post("/api/feedbacks", requireApiStaff, feedbackController.store);
router.get("/api/feedbacks/:id", requireApiStaff, feedbackController.show);
router.delete("/api/feedbacks/:id", requireApiStaff, feedbackController.destroy);


// Management Pages
router.get("/orders", requirePageStaff, (req, res) => {
    res.render("orders", { title: "Orders" });
});

router.get("/water-activities", requirePageStaff, (req, res) => {
    res.render("water-activities", { title: "Water Activities" });
});

router.get("/feedbacks", requirePageStaff, (req, res) => {
    res.render("feedbacks", { title: "Customer Feedbacks" });
});

export default router;

import { orderController } from "../controllers/orderController.js";
import { waterActivityController } from "../controllers/waterActivityController.js";
import { feedbackController } from "../controllers/feedbackController.js";


