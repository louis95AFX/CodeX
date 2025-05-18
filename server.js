const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");
const crypto = require("crypto"); // Make sure this is at the top of your file

const app = express();

const pool = new Pool({
  user: "neondb_owner",
  host: "ep-morning-bonus-a405xosx-pooler.us-east-1.aws.neon.tech",
  database: "codex",
  password: "npg_RBuV5kZmtn7p",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
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
        'INSERT INTO "CodeX".users (name, surname, email, cell, dob, gender, password, student_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [name, surname, email, cell, dob, gender, hashedPassword, student_id]
      );
  
      const userId = result.rows[0].id;
  
      // Send a success response back to the user
      res.status(200).json({ message: 'User registered successfully!', userId });
  
      // Optional: Send a welcome email
     const mailOptions = {
  from: 'CODEX <louisphiri955@gmail.com>',
  to: email,
  subject: "Welcome to CodeX – Your Learning Journey Starts Now!",
  text: `Hi ${name},\n\n` +
        `Welcome to CodeX! We're thrilled to have you join our community of learners.\n\n` +
        `Your Student ID is: ${student_id}\n\n` +
        `At CodeX, you have access to a wide range of online courses designed to help you grow your skills at your own pace.\n` +
        `Feel free to explore, learn, and reach out if you need any assistance.\n\n` +
        `Get started today by logging into your account and browsing our course catalog.\n\n` +
        `Happy learning!\n\n` +
        `Best regards,\n` +
        `The CodeX Team`
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

    // Route to serve resetpass.html
app.get('/resetpass.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resetpass.html'));
});

    // REQUEST PASSWORD RESET
    app.post("/request-password-reset", async (req, res) => {
      const { email } = req.body;
    
      try {
        // Check if the email exists
        const userResult = await pool.query('SELECT id FROM CodeX.users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
          return res.status(404).json({ message: "Email not found" });
        }
    
        const userId = userResult.rows[0].id;
    
        // Delete old tokens (clean up)
        await pool.query('DELETE FROM CodeX.password_resets WHERE expires_at < NOW()');
    
        // Check if a valid token already exists
        const tokenResult = await pool.query(
          'SELECT * FROM CodeX.password_resets WHERE email = $1 AND expires_at > NOW()',
          [email]
        );
    
        if (tokenResult.rows.length > 0) {
          return res.status(429).json({
            message: "A reset link has already been sent. Please try again later."
          });
        }
    
        // Generate token
        const token = crypto.randomBytes(20).toString('hex');
    
        // Insert the token
        await pool.query(
          `INSERT INTO CodeX.password_resets (user_id, email, token, expires_at)
           VALUES ($1, $2, $3, NOW() + INTERVAL '24 hour')`,
          [userId, email, token]
        );
    
        const resetLink = `http://localhost:5000/resetpass.html?token=${token}`;
        const mailOptions = {
          from: 'CODEX <louisphiri955@gmail.com>',
          to: email,
          subject: "Password Reset Request",
          text: `Hello,\n\nTo reset your password, click the following link: ${resetLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nCodeX Team`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error sending email:", error);
            return res.status(500).json({ message: "Error sending reset email" });
          } else {
            console.log("Reset email sent: " + info.response);
            return res.status(200).json({ message: "Password reset link sent" });
          }
        });
    
      } catch (err) {
        console.error("Error handling password reset request:", err);
        res.status(500).json({ message: "Error processing password reset" });
      }
    });
    
// RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Validate token and expiration
    const result = await pool.query(
      'SELECT user_id, expires_at FROM CodeX.password_resets WHERE token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { user_id, expires_at } = result.rows[0];

    console.log("Token Expiration Time:", expires_at);
    console.log("Current Time (UTC):", new Date().toISOString());

    if (new Date(expires_at).toISOString() < new Date().toISOString()) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await pool.query(
      'UPDATE CodeX.users SET password = $1 WHERE id = $2',
      [hashedPassword, user_id]
    );

    // Delete the token
    await pool.query('DELETE FROM CodeX.password_resets WHERE token = $1', [token]);

    res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
});
    
      app.get("/user/:id", async (req, res) => {
        const userId = req.params.id;
        try {
          const result = await pool.query(
            `SELECT name, surname, email, cell, dob, gender, student_id, profile_pic 
            FROM "CodeX"."users" WHERE id = $1`,
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
    const result = await pool.query(
      'SELECT * FROM "CodeX".users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id
      }
    });

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
  
  app.post('/savePurchase', async (req, res) => {
    const { course, price, email, created_at } = req.body;
    try {
      // Insert purchase data into the database
      await pool.query(
        'INSERT INTO "CodeX".purchases (email, course, amount, created_at) VALUES ($1, $2, $3, $4)',
        [email, course, price, created_at]
      );
       // 2. Log recent activity
    await pool.query(
      `INSERT INTO "CodeX".recent_activity (email, title, icon, color) 
       VALUES ($1, $2, $3, $4)`,
      [
        email,
        `Purchased ${course} course`,
        'fas fa-shopping-cart',
        'text-yellow-500'
      ]
    );

    res.status(200).json({ message: 'Course purchased and activity logged' });
  } catch (err) {
    console.error("Error in purchaseCourse:", err);
    res.status(500).json({ message: "Purchase failed" });
  }
});
  
  app.get('/getPurchases', async (req, res) => {
  const { email } = req.query;
  try {
    const result = await pool.query(
      'SELECT course, amount, created_at FROM "CodeX".purchases WHERE email = $1 ORDER BY created_at DESC',
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving purchases:", err);
    res.status(500).json({ message: "Error retrieving purchase history." });  // <-- send JSON here
  }
});


app.get('/getUserCourses', async (req, res) => {
  const { email } = req.query;
  console.log("Fetching courses for email:", email);
  try {
    const result = await pool.query(
      'SELECT * FROM "CodeX".purchases WHERE email = $1',
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user courses:", err);
    res.status(500).json({ message: "Error fetching user courses" });
  }
});

app.post('/addActivity', async (req, res) => {
  const { email, title, icon, color } = req.body;
  try {
    await pool.query(
      `INSERT INTO "CodeX".recent_activity (email, title, icon, color) VALUES ($1, $2, $3, $4)`,
      [email, title, icon, color]
    );
    res.status(200).json({ message: "Activity logged" });
  } catch (err) {
    console.error("Error adding activity:", err);
    res.status(500).json({ message: "Failed to log activity" });
  }
});

app.get('/getUserActivity', async (req, res) => {
  const { email } = req.query;

  try {
    const result = await pool.query(
      `SELECT title, icon, color, time 
       FROM "CodeX".recent_activity 
       WHERE email = $1 
       ORDER BY time DESC 
       LIMIT 10`,
      [email]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching activity:", err);
    res.status(500).json({ message: "Failed to load activity" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
