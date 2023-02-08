import express from "express";
import router from "./routes/router";

// Create an instance of the express app
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Use the router for all requests with the URL prefix "/api"
app.use("/api", router);

// Get the port from the environment variables or use 3000 as the default
const port = process.env.PORT || 3000;

// Start the express app on the specified port and log a message when it is ready to handle requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;