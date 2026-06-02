const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.post("/api/join", async (req, res) => {

  try {

    const { fullName, email, userType } = req.body;

    if (!fullName || !email || !userType) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const { error } = await supabase
      .from("join_requests")
      .insert([
        {
          full_name: fullName,
          email: email,
          user_type: userType
        }
      ]);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      message: "Successfully joined"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Server error"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});