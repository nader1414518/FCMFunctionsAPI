const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const FCM_CLIENT_API_KEY = "AIzaSyAorpsSiAfmNXTkKwdmkuBNImSBZndfdDg";
const VUE_APP_FCM_SEND_URL_V2 =
  "https://fcm.googleapis.com/v1/projects/yttodoapp-1dacb/messages:send";

admin.initializeApp();

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/generate_fcm_token", async (req, res) => {
  try {
    if (
      req.headers.authorization === "" ||
      req.headers.authorization === undefined
    ) {
      res.json({
        result: false,
        message: "Please provide the api key",
      });
      return;
    }

    const auth = req.headers.authorization;
    const token = auth.replace("Bearer ", "").trim();

    if (token !== FCM_CLIENT_API_KEY) {
      console.log(token);
      console.log(FCM_CLIENT_API_KEY);

      res.json({
        result: false,
        message: "401 Unauthorized",
      });
      return;
    }

    const accessToken = await admin
      .auth()
      .app.options.credential.getAccessToken();

    res.json({
      result: true,
      message: "Success",
      token: accessToken.access_token,
    });
  } catch (error) {
    res.json({
      result: false,
      message: error,
    });
  }
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
