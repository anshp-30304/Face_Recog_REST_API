import fetch from "node-fetch";
import User from "./models/User.js";

// Example credentials
const username = "14";
const password = "14";

let parallelRequests = 1500;
const maxDuration = 5 * 60 * 1000;
let startTime = Date.now();

async function getFaceDataFromDB(username,password) {
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ error: "Invalid username" });
  return user
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
}

async function makeRequest(faceData) {
  try {
    const res = await fetch(`http://3.24.169.106:3000/api/auth/verify-face`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, faceData }),
    });
    const data = await res.json();
    console.log(data.message || data.error);
  } catch (err) {
    console.error("Request error:", err.message);
  }
}

async function runLoad() {
  let iterationCount = 0;

  // Get the faceData from DB once
  let faceData;
  try {
    faceData = await getFaceDataFromDB(username,password); // Fetch faceData from the database
  } catch (error) {
    console.error("Failed to retrieve faceData. Exiting load test.");
    return; // Exit if faceData can't be fetched
  }
   while (Date.now() - startTime < maxDuration) {
    try {
      // Create an array of parallel requests with the same faceData
      const requests = Array.from({ length: parallelRequests }, () => makeRequest(faceData));

      // Wait for all requests to complete
      await Promise.all(requests);

      console.log(`Iteration ${iterationCount + 1} completed successfully.`);

      iterationCount++;

    } catch (error) {
      console.error("Error in making requests:", error);
      break;
    }
  }

  console.log("Test completed after 5 minutes.");
}

console.log("Starting load test... Press Ctrl+C to stop.");
runLoad();