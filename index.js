require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');  // Add this line

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI, {
  
  })
  .then(() => {
    console.log('MongoDB Connected Successfully!');
  })
  .catch((err) => {
    console.error('MongoDB Connection Failed:', err);
  });
  
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Algorithm X</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #eef2f5;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
        }
        .logo {
            max-width: 180px;
            margin-bottom: 25px;
        }
        h1 {
            font-size: 26px;
            margin-bottom: 15px;
            color: #222;
        }
        p {
            font-size: 18px;
            margin-bottom: 30px;
            color: #555;
        }
        .open-app-button {
            background-color: #28a745;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 18px;
            transition: background-color 0.3s ease;
        }
        .open-app-button:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Algorithm X</h1>
        <p>Your journey into smart tech solutions starts here. To proceed, click below to open the Algorithm X.</p>
    </div>
</body>
</html>
`;

  res.send(htmlContent);
});

app.use("/api/", userRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
