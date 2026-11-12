
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
    

/*
  MIT License

  Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
  Mindoro State University - Philippines
*/

import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

export const loginPage = (req, res) =>
  res.render("login", { title: "Login" });

export const registerPage = (req, res) =>
  res.render("register", { title: "Register" });

export const forgotPasswordPage = (req, res) =>
  res.render("forgotpassword", { title: "Forgot Password" });

export const dashboardPage = (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  res.render("dashboard", { title: "Dashboard" });
};

export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }

    const user = await User.findOne({
  where: { email }
});

    if (!user) {
      return res.status(401).send("User not found.");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send("Incorrect password.");
    }

    req.session.userId = user.id;
    return res.redirect("/dashboard");

  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).send(
      "Login failed. Please check the database configuration."
    );
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send(
        "Name, email, and password are required."
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).send(
        "This email is already registered. Please use another email."
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role: "visitors"
    });

    req.session.userId = user.id;
    return res.redirect("/dashboard");

  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).send(
      "Registration failed. Please try again."
    );
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};