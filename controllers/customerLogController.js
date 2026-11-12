
import { CustomerLog } from "../models/customerLogModel.js";
import { Customer } from "../models/customerModel.js";

export const customerLogController = {
  // Display all customer logs
  index: async (req, res) => {
    try {
      const logs = await CustomerLog.findAll({
        include: [
          {
            model: Customer,
            as: "customer"
          }
        ],
        order: [["loggedAt", "DESC"]]
      });

      return res.json({
        success: true,
        data: logs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve customer logs.",
        error: error.message
      });
    }
  },

  // Display logs of a specific customer
  getByCustomer: async (req, res) => {
    try {
      const { customerId } = req.params;

      const logs = await CustomerLog.findAll({
        where: { customerId },
        order: [["loggedAt", "DESC"]]
      });

      return res.json({
        success: true,
        data: logs
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve customer logs.",
        error: error.message
      });
    }
  },

  // Create a customer log
  store: async (req, res) => {
    try {
      const {
        customerId,
        logType,
        description,
        status
      } = req.body;

      if (!customerId || !logType || !description) {
        return res.status(400).json({
          success: false,
          message: "Customer ID, log type, and description are required."
        });
      }

      const customer = await Customer.findByPk(customerId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found."
        });
      }

      const log = await CustomerLog.create({
        customerId,
        logType,
        description,
        status
      });

      return res.status(201).json({
        success: true,
        message: "Customer log created successfully.",
        data: log
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create customer log.",
        error: error.message
      });
    }
  },

  // Update customer log status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "open",
        "in_progress",
        "resolved",
        "closed"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid customer log status."
        });
      }

      const log = await CustomerLog.findByPk(id);

      if (!log) {
        return res.status(404).json({
          success: false,
          message: "Customer log not found."
        });
      }

      await log.update({ status });

      return res.json({
        success: true,
        message: "Customer log status updated successfully.",
        data: log
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update customer log status.",
        error: error.message
      });
    }
  }
};
