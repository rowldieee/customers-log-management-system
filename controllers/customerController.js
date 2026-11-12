
import { Customer } from "../models/customerModel.js";

export const customerController = {
  // Display all customers
  index: async (req, res) => {
    try {
      const customers = await Customer.findAll({
        order: [["createdAt", "DESC"]]
      });

      return res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve customers."
      });
    }
  },

  // Create a new customer
  store: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        middleName,
        contactNumber,
        email,
        address
      } = req.body;

      if (!firstName || !lastName || !contactNumber || !address) {
        return res.status(400).json({
          success: false,
          message: "First name, last name, contact number, and address are required."
        });
      }

      const customer = await Customer.create({
        firstName,
        lastName,
        middleName,
        contactNumber,
        email,
        address
      });

      return res.status(201).json({
        success: true,
        message: "Customer created successfully.",
        data: customer
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create customer."
      });
    }
  },

  // View one customer
  show: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found."
        });
      }

      return res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve customer."
      });
    }
  },

  // Update customer information
  update: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found."
        });
      }

      const allowedFields = [
        "firstName",
        "lastName",
        "middleName",
        "contactNumber",
        "email",
        "address"
      ];

      const updates = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      await customer.update(updates);

      return res.json({
        success: true,
        message: "Customer updated successfully.",
        data: customer
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update customer."
      });
    }
  },

  // Archive customer (soft archive)
  archive: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found."
        });
      }

      await customer.update({
        status: "inactive"
      });

      return res.json({
        success: true,
        message: "Customer archived successfully."
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to archive customer."
      });
    }
  }
};
