
import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Customer = sequelize.define(
  "Customer",
  {
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    middleName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    tableName: "customers",
    timestamps: true
  }
);
