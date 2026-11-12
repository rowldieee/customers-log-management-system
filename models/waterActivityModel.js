import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { Customer } from "./customerModel.js";

export const WaterActivity = sequelize.define(
  "WaterActivity",
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
    activityType: {
      type: DataTypes.ENUM("refill", "delivery", "pickup", "other"),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    activityDate: {
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
    tableName: "water_activities",
    timestamps: true
  }
);

Customer.hasMany(WaterActivity, {
  foreignKey: "customerId",
  as: "waterActivities"
});

WaterActivity.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer"
});
