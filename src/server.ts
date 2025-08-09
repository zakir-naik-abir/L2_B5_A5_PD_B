import { Server } from "http";

import mongoose from "mongoose";
import { envVars } from "./config/env";
import app from "./app"

let server: Server;

const startServer = async () => {
  try {
    server = app.listen(envVars.PORT, () => {
      console.log(`🚚 Parcel Delivery API is running on Port: ${envVars.PORT}`);
    });

    await mongoose.connect(envVars.DB_URL)
    console.log(`✅ Connected to MongoDB Successfully!`)

  } catch (error) {
    console.log(`❌ Failed to connect ${error}`);
  }
};

(async () => {
  await startServer()
})();

