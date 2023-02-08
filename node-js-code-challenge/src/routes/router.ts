import { Router } from "express";
import {
  checkIfOrderCanBeFulfilled,
  getMinCostForOrderFulfillment,
  updateApparel,
  updateMultipleApparels,
} from "../controllers/controller";

const router: Router = Router();

// Update the stock quality and price of one apparel code and size
router.patch("/apparel", updateApparel);

// Update the stock quality and price of multiple apparel codes and sizes
router.put("/apparels", updateMultipleApparels);

// Check if the customer order can be fulfilled
router.post("/order", checkIfOrderCanBeFulfilled);

// Get the lowest cost to fulfill the customer order
router.post("/order/cost", getMinCostForOrderFulfillment);

export default router;
