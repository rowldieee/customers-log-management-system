import { Feedback } from "../models/feedbackModel.js";
import { Customer } from "../models/customerModel.js";

export const feedbackController = {
    // Display all feedback
    index: async (req, res) => {
        try {
            const feedbacks = await Feedback.findAll({
                include: [{ model: Customer, as: "customer" }],
                order: [["createdAt", "DESC"]]
            });

            return res.json({ success: true, data: feedbacks });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve feedback."
            });
        }
    },

    // Create customer feedback
    store: async (req, res) => {
        try {
            const { customerId, rating, message } = req.body;

            if (
                !customerId ||
                rating === undefined ||
                rating === null ||
                rating === "" ||
                !message
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Customer, rating, and feedback message are required."
                });
            }

            if (
                !Number.isInteger(Number(rating)) ||
                Number(rating) < 1 ||
                Number(rating) > 5
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be a whole number from 1 to 5."
                });
            }

            const customer = await Customer.findByPk(customerId);

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found."
                });
            }

            const feedback = await Feedback.create({
                customerId,
                rating,
                message
            });

            return res.status(201).json({
                success: true,
                message: "Feedback submitted successfully.",
                data: feedback
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to submit feedback."
            });
        }
    },

    // View one feedback
    show: async (req, res) => {
        try {
            const feedback = await Feedback.findByPk(req.params.id, {
                include: [{ model: Customer, as: "customer" }]
            });

            if (!feedback) {
                return res.status(404).json({
                    success: false,
                    message: "Feedback not found."
                });
            }

            return res.json({ success: true, data: feedback });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve feedback."
            });
        }
    },

    // Delete feedback
    destroy: async (req, res) => {
        try {
            const feedback = await Feedback.findByPk(req.params.id);

            if (!feedback) {
                return res.status(404).json({
                    success: false,
                    message: "Feedback not found."
                });
            }

            await feedback.destroy();

            return res.json({
                success: true,
                message: "Feedback deleted successfully."
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete feedback."
            });
        }
    }
};
