import { Order } from "../models/orderModel.js";
import { Customer } from "../models/customerModel.js";

const allowedStatuses = ["pending", "completed", "cancelled"];

export const orderController = {
    // Display all orders
    index: async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [{ model: Customer, as: "customer" }],
                order: [["orderedAt", "DESC"]]
            });

            return res.json({ success: true, data: orders });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve orders."
            });
        }
    },

    // Create an order
    store: async (req, res) => {
        try {
            const {
                orderNo,
                customerId,
                totalAmount,
                paymentMethod,
                status,
                orderedAt,
                notes
            } = req.body;

            if (
                !orderNo ||
                !customerId ||
                totalAmount === undefined ||
                totalAmount === null ||
                totalAmount === "" ||
                !paymentMethod
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Order number, customer, total amount, and payment method are required."
                });
            }

            if (!Number.isFinite(Number(totalAmount)) || Number(totalAmount) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Total amount must be a valid non-negative number."
                });
            }

            if (status && !allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order status."
                });
            }

            const customer = await Customer.findByPk(customerId);

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found."
                });
            }

            const order = await Order.create({
                orderNo,
                customerId,
                totalAmount,
                paymentMethod,
                status,
                orderedAt,
                notes
            });

            return res.status(201).json({
                success: true,
                message: "Order created successfully.",
                data: order
            });
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(409).json({
                    success: false,
                    message: "Order number already exists."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to create order."
            });
        }
    },

    // View one order
    show: async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: [{ model: Customer, as: "customer" }]
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });
            }

            return res.json({ success: true, data: order });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve order."
            });
        }
    },

    // Update order details
    update: async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });
            }

            const allowedFields = [
                "orderNo",
                "customerId",
                "totalAmount",
                "paymentMethod",
                "status",
                "orderedAt",
                "notes"
            ];

            const updates = {};

            for (const field of allowedFields) {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            }

            if (
                updates.totalAmount !== undefined &&
                (!Number.isFinite(Number(updates.totalAmount)) ||
                    Number(updates.totalAmount) < 0)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Total amount must be a valid non-negative number."
                });
            }

            if (
                updates.status !== undefined &&
                !allowedStatuses.includes(updates.status)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid order status."
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

            await order.update(updates);

            return res.json({
                success: true,
                message: "Order updated successfully.",
                data: order
            });
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(409).json({
                    success: false,
                    message: "Order number already exists."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Failed to update order."
            });
        }
    }
};
