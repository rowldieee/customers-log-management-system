
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Customer } from "./customerModel.js";

export const CustomerLog = sequelize.define(
  "CustomerLog",
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
    logType: {
      type: DataTypes.ENUM("refill", "concern", "feedback"),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        "open",
        "in_progress",
        "resolved",
        "closed"
      ),
      allowNull: false,
      defaultValue: "open"
    },
    loggedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "customer_logs",
    timestamps: true
  }
);

Customer.hasMany(CustomerLog, {
  foreignKey: "customerId",
  as: "logs"
});

CustomerLog.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer"
});
