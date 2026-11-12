import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Customer } from "./customerModel.js";

export const Order = sequelize.define(
  "Order",
  {
    orderNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending"
    },
    orderedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "orders",
    timestamps: true
  }
);

Customer.hasMany(Order, {
  foreignKey: "customerId",
  as: "orders"
});

Order.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer"
});
