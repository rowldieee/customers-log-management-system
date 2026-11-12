import { sequelize } from "./db.js";

import { User } from "./userModel.js";
import { Customer } from "./customerModel.js";
import { CustomerLog } from "./customerLogModel.js";
import { Order } from "./orderModel.js";
import { WaterActivity } from "./waterActivityModel.js";
import { Feedback } from "./feedbackModel.js";

export {
    sequelize,
    User,
    Customer,
    CustomerLog,
    Order,
    WaterActivity,
    Feedback
};
