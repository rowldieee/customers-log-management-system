import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Customer } from "./customerModel.js";

export const Feedback = sequelize.define(
  "Feedback",
  {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "id"
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE"
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    tableName: "feedbacks",
    timestamps: true
  }
);

Customer.hasMany(Feedback, {
  foreignKey: "customerId",
  as: "feedbacks"
});

Feedback.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer"
});
