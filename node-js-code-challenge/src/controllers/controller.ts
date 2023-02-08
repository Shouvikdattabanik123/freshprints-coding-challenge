import { Request, Response } from "express";
import statusCodes from "../constants/statusCodes";
import { readData, writeData } from "../models/model";
import { Apparel } from "../types/Apparel";

export const updateApparel = async (req: Request, res: Response) => {
  try {
    // Get the current list of apparels from the data source i.e the apparels.json file
    const apparels: Apparel[] = await readData();

    // Extract the data for the apparel to be updated from the request body
    const { code, size, stock, price } = req.body;

    // Check if all required fields are present in the request body
    if (
      !code ||
      !size ||
      typeof stock === "undefined" ||
      typeof price === "undefined"
    ) {
      // If a required field is missing, return a 400 Bad Request response
      res
        .status(statusCodes.BAD_REQUEST)
        .json({ message: "Code, size, stock and price are required fields" });
      return;
    }

    // Find the index of the apparel with the specified code and size
    const index = apparels.findIndex(
      (apparel) => apparel.code === code && apparel.size === size
    );

    // If the apparel is not found, return a 404 Not Found error
    if (index === -1) {
      res.status(statusCodes.NOT_FOUND).json({ message: "Apparel not found" });
      return;
    }

    // Update the stock and price for the apparel
    apparels[index].stock = stock;
    apparels[index].price = price;

    // Write the updated list of apparels back to the data source i.e the apparels.json file
    await writeData(apparels);
    res.status(statusCodes.OK).json({ message: "Apparel updated" });
  } catch (err) {
    // Log the error
    console.error(err);
    // If an error occurs, return a 500 Internal Server Error
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update apparel, please try again" });
  }
};

export const updateMultipleApparels = async (req: Request, res: Response) => {
  try {
    // Read the existing apparels data from the data source i.e the apparels.json file
    const apparels: Apparel[] = await readData();

    // Get the updates from the request body
    const updates = req.body;

    // Check if the request body is a non-empty array
    if (!Array.isArray(updates) || !updates.length) {
      return res.status(statusCodes.BAD_REQUEST).json({
        error: "Request Body must be a non-empty array of apparels",
      });
    }

    let success = true;

    // Iterate through each update
    updates.forEach((update: Apparel) => {
      // Extract the data for each apparel to be updated
      const { code, size, stock, price } = update;

      // Find the index of that apparel with the specified code and size
      const index = apparels.findIndex(
        (apparel) => apparel.code === code && apparel.size === size
      );

      // If the apparel is not found, return a 404 Not Found error
      if (index === -1) {
        success = false;
        return res.status(statusCodes.NOT_FOUND).json({
          message: "Apparel not found",
          apparel: update,
        });
      }

      // Check if the update has all the required fields
      if (
        !code ||
        !size ||
        typeof stock === "undefined" ||
        typeof price === "undefined"
      ) {
        success = false;
        // If a required field is missing, return a 400 Bad Request error
        return (
          !res.headersSent &&
          res.status(statusCodes.BAD_REQUEST).json({
            error: "Code, size, stock, and price are required fields",
          })
        );
      }

      // Update the apparel in the array
      apparels[index].stock = stock;
      apparels[index].price = price;
    });

    // If any of the updates failed, return
    if (!success) {
      return;
    }

    // Write the updated apparels data
    await writeData(apparels);

    // Return a success response
    res.status(statusCodes.OK).json({ message: "Apparels updated" });
  } catch (err) {
    // Log the error
    console.error(err);
    // If an error occurs, return a 500 Internal Server Error
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to update the apparels, please try again",
    });
  }
};

export const checkIfOrderCanBeFulfilled = async (
  req: Request,
  res: Response
) => {
  try {
    // Read the existing apparels data from the data source i.e the apparels.json file
    const apparels: Apparel[] = await readData();
    // Get the items to be ordered from the request body
    const items = req.body;

    // Check if the request body is a non-empty array of apparels
    if (!Array.isArray(items) || !items.length) {
      // If the request body is invalid, return a 400 Bad Request
      return res.status(statusCodes.BAD_REQUEST).json({
        error: "Request Body must be a non-empty array of apparels",
      });
    }

    // Keep track of whether the order can be fulfilled
    let canFulfill = true;
    // Keep track of the items that cannot be fulfilled
    const notFulfilled: any[] = [];

    // Loop through each item to be ordered
    items.forEach((item: any) => {
      const { code, size, quantity } = item;

      // Check if the required fields (code, size, and quantity) are present
      if (!code || !size || typeof quantity === "undefined") {
        // If a required field is missing, return a 400 Bad Request
        return res.status(statusCodes.BAD_REQUEST).json({
          error: "Code, size, and quantity are required fields",
        });
      }

      // Check if the quantity is less than 0
      if (quantity < 0) {
        // If the quantity is less than 0, return a 400 Bad Request
        return res.status(statusCodes.BAD_REQUEST).json({
          error: "Quantity must be greater than 0",
        });
      }

      // Find the index of the apparel in the existing apparels with the same code and size
      const index = apparels.findIndex(
        (apparel) => apparel.code === code && apparel.size === size
      );

      // Check if the apparel was found
      if (index === -1) {
        // If the apparel was not found, update canFulfill and add to notFulfilled list
        canFulfill = false;
        notFulfilled.push({ code, size });
      } else if (apparels[index].stock < quantity) {
        // If the stock of the apparel is less than the quantity requested, update canFulfill and add to notFulfilled list
        canFulfill = false;
        notFulfilled.push({
          code,
          size,
          availableStock: apparels[index].stock,
        });
      }
    });

    // If the order can be fulfilled, return a succes response with a message
    if (canFulfill) {
      !res.headersSent &&
        res.status(statusCodes.OK).json({ message: "Order can be fulfilled" });
    } else {
      // If the order cannot be fulfilled, return a 400 Bad Request with a message and the notFulfilled list
      res.status(statusCodes.BAD_REQUEST).json({
        message: "Order cannot be fulfilled",
        notFulfilled,
      });
    }
  } catch (err) {
    // Log the error
    console.error(err);
    // If an error occurs, return a 500 Internal Server Error
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to check the order fulfillment, please try again",
    });
  }
};

export const getMinCostForOrderFulfillment = async (
  req: Request,
  res: Response
) => {
  try {
    // Read the existing apparels data from the data source i.e the apparels.json file
    const apparels: Apparel[] = await readData();
    // Get the items from the request body
    const items = req.body;

    // Validate if the request body is a non-empty array of apparels
    if (!Array.isArray(items) || !items.length) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ error: "Request Body must be a non-empty array of apparels" });
    }

    // Initialize the total cost to 0
    let totalCost = 0;
    // Flag to indicate if all items are valid
    let allItemsValid = true;

    // Iterate through each item
    items.forEach((item: any) => {
      const { code, size, quantity } = item;

      // Validate if all required fields are present
      if (!code || !size || typeof quantity === "undefined") {
        allItemsValid = false;
        return res
          .status(statusCodes.BAD_REQUEST)
          .json({ error: "Code, size, and quantity are required fields" });
      }

      // Check if quantity is greater than 0
      if (quantity < 0) {
        allItemsValid = false;
        return res.status(statusCodes.BAD_REQUEST).json({
          error: `Quantity for apparel with code '${code}' and size '${size}' must be greater than 0`,
        });
      }

      // Find the index of the apparel with the given code and size
      const index = apparels.findIndex(
        (apparel) => apparel.code === code && apparel.size === size
      );

      // If the apparel with the given code and size is not found
      if (index === -1) {
        allItemsValid = false;
        return res.status(statusCodes.NOT_FOUND).json({
          error: `Apparel with code '${code}' and size '${size}' not found`,
        });
      }

      // If the stock of the apparel is less than the requested quantity
      if (apparels[index].stock < quantity) {
        allItemsValid = false;
        return res.status(statusCodes.BAD_REQUEST).json({
          error: `Not enough stock for apparel with code '${code}' and size '${size}'`,
        });
      }

      // Add the cost of the item to the total cost
      totalCost += apparels[index].price * quantity;
    });

    // If all items are valid
    if (allItemsValid) {
      // Return the total cost
      res.status(statusCodes.OK).json({ totalCost });
    }
  } catch (err) {
    console.error(err);
    // If an error occurs, return a 500 Internal Server Error
    res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to retrieve the total cost, please try again" });
  }
};
