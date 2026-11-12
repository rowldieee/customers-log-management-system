import { WaterActivity } from "../models/waterActivityModel.js";
import { Customer } from "../models/customerModel.js";

const allowedTypes = ["refill", "delivery", "pickup", "other"];

export const waterActivityController = {
    // Display all water activities
    index: async (req, res) => {
        try {
            const activities = await WaterActivity.findAll({
                include: [{ model: Customer, as: "customer" }],
                order: [["activityDate", "DESC"]]
            });

            return res.json({ success: true, data: activities });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve water activities."
            });
        }
    },

    // Create a water activity
    store: async (req, res) => {
        try {
            const {
                customerId,
                activityType,
                quantity,
                amount,
                activityDate,
                notes
            } = req.body;

            if (
                !customerId ||
                !activityType ||
                quantity === undefined ||
                quantity === null ||
                quantity === "" ||
                amount === undefined ||
                amount === null ||
                amount === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Customer, activity type, quantity, and amount are required."
                });
            }

            if (!allowedTypes.includes(activityType)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid water activity type."
                });
            }

            if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be a positive whole number."
                });
            }

            if (!Number.isFinite(Number(amount)) || Number(amount) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be a valid non-negative number."
                });
            }

            const customer = await Customer.findByPk(customerId);

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found."
                });
            }

            const activity = await WaterActivity.create({
                customerId,
                activityType,
                quantity,
                amount,
                activityDate,
                notes
            });

            return res.status(201).json({
                success: true,
                message: "Water activity created successfully.",
                data: activity
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create water activity."
            });
        }
    },

    // View one water activity
    show: async (req, res) => {
        try {
            const activity = await WaterActivity.findByPk(req.params.id, {
                include: [{ model: Customer, as: "customer" }]
            });

            if (!activity) {
                return res.status(404).json({
                    success: false,
                    message: "Water activity not found."
                });
            }

            return res.json({ success: true, data: activity });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve water activity."
            });
        }
    },

    // Update water activity
    update: async (req, res) => {
        try {
            const activity = await WaterActivity.findByPk(req.params.id);

            if (!activity) {
                return res.status(404).json({
                    success: false,
                    message: "Water activity not found."
                });
            }

            const allowedFields = [
                "customerId",
                "activityType",
                "quantity",
                "amount",
                "activityDate",
                "notes"
            ];

            const updates = {};

            for (const field of allowedFields) {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            }

            if (
                updates.activityType !== undefined &&
                !allowedTypes.includes(updates.activityType)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid water activity type."
                });
            }

            if (
                updates.quantity !== undefined &&
                (!Number.isInteger(Number(updates.quantity)) ||
                    Number(updates.quantity) <= 0)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Quantity must be a positive whole number."
                });
            }

            if (
                updates.amount !== undefined &&
                (!Number.isFinite(Number(updates.amount)) ||
                    Number(updates.amount) < 0)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Amount must be a valid non-negative number."
                });
            }

            if (updates.customerId !== undefined) {
                const customer = await Customer.findByPk(updates.customerId);

                if (!customer) {
                    return res.status(404).json({
                        success: false,
                        message: "Customer not found."
                    });
                }
            }

            await activity.update(updates);

            return res.json({
                success: true,
                message: "Water activity updated successfully.",
                data: activity
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to update water activity."
            });
        }
    }
};
