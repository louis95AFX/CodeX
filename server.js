const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const pool = new Pool({
  user: "postgres",
  host: "tramway.proxy.rlwy.net",
  database: "railway",
  password: "kvDUeCiOmhyzAFkOPIaTTaiMOHlnLFfj",
  port: 12253,
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Ensure this middleware is in place to parse JSON data

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve 'register.html' at the '/register' route
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// Test database connection
pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL");
    return client
      .query("SELECT current_database();")
      .then((res) => {
        console.log("Connected to database:", res.rows[0].current_database);
        client.release();
      });
  })
  .catch((err) => {
    console.error("❌ PostgreSQL Connection Error:", err);
    process.exit(1);
  });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "louisphiri955@gmail.com", // Your Gmail
    pass: "memd nauy jnmt nglw", // Generated App Password
  },
});

const multer = require("multer");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Endpoint to upload profile picture
app.post("/upload-profile-pic/:id", upload.single("profilePic"), async (req, res) => {
    const userId = req.params.id;
    const imagePath = `/uploads/${req.file.filename}`;
  
    try {
      await pool.query("UPDATE CodeX.users SET profile_pic = $1 WHERE id = $2", [imagePath, userId]);
      res.json({ message: "Profile picture uploaded", imageUrl: imagePath });
    } catch (err) {
      console.error("Error updating profile pic:", err);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  });
  

// Route to handle registration
app.post("/register", async (req, res) => {
    const { name, surname, email, cell, dob, gender, password, student_id } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert the data into the users table (including student_id)
      const result = await pool.query(
        'INSERT INTO CodeX.users (name, surname, email, cell, dob, gender, password, student_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [name, surname, email, cell, dob, gender, hashedPassword, student_id]
      );
  
      const userId = result.rows[0].id;
  
      // Send a success response back to the user
      res.status(200).json({ message: 'User registered successfully!', userId });
  
      // Optional: Send a welcome email
      const mailOptions = {
        from: "louisphiri955@gmail.com",
        to: email,
        subject: "Welcome to CodeX!",
        text: `Hello ${name},\n\nThank you for signing up with CodeX! Your Student ID is: ${student_id}\n\nBest regards,\nCodeX Team`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
  
    } catch (err) {
        console.error("Error during registration:", err);
    
        if (err.code === '23505') {
          // PostgreSQL duplicate entry error code
          res.status(400).json({ message: "Duplicate student ID" });
        } else {
          res.status(500).json({ message: "Error registering user" });
        }
      }
    });

    app.get("/user/:id", async (req, res) => {
        const userId = req.params.id;
        try {
          const result = await pool.query(
            "SELECT name, surname, email, cell, dob, gender, student_id, profile_pic FROM CodeX.users WHERE id = $1",
            [userId]
          );
          if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }
          res.json(result.rows[0]);
        } catch (err) {
          console.error("Error fetching user:", err);
          res.status(500).json({ message: "Internal server error" });
        }
      });
      

      // Route to get user data by ID
      app.get("/user/:id", async (req, res) => {
        const userId = req.params.id;
        try {
          const result = await pool.query(
            "SELECT name, surname, email, cell, dob, gender, student_id, profile_pic FROM CodeX.users WHERE id = $1",
            [userId]
          );
          if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
          }
      
          const user = result.rows[0];
      
          // Make profile_pic a full URL
          if (user.profile_pic) {
            user.profile_pic = `${req.protocol}://${req.get("host")}${user.profile_pic}`;
          }
      
          res.json(user);
        } catch (err) {
          console.error("Error fetching user:", err);
          res.status(500).json({ message: "Internal server error" });
        }
      });
      
      
  // Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query("SELECT * FROM CodeX.users WHERE email = $1", [email]);
  
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      res.status(200).json({ message: "Login successful", userId: user.id });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get("/check-email", async (req, res) => {
    const email = req.query.email;
  
    try {
      const result = await pool.query("SELECT id FROM CodeX.users WHERE email = $1", [email]);
  
      if (result.rows.length > 0) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } catch (err) {
      console.error("Error checking email:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
      
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
