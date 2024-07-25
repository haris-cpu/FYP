// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const adminmiddleware = require("./middleware/admin.middleware");
const authmiddleware = require("./middleware/auth.middleware");
const authroute = require("./routes/auth");
const rolesroute = require("./routes/roles");
const userroute = require("./routes/user");
const grouproute = require("./routes/group");
const taskgroup = require("./routes/task");
const calandergroup = require("./routes/calender");
const assesmentroute = require("./routes/assesment");
const sessionroute = require("./routes/session");
const graderoute = require("./routes/grade");
const assignmentRoute = require("./routes/assignment"); 
const folderRoute = require("./routes/folder")
const documentRoute =require("./routes/document")

const cors = require('cors');

const app = express();
const port = process.env.PORT;
// Use CORS middleware
app.use(cors());

app.use('/uploads', express.static('uploads'));


// Databse Connection 
mongoose.connect(process.env.DB_URI, { useNewUrlParser:true , useUnifiedTopology:true }) 
const db = mongoose.connection;
db.on("error" , (error) => console.log(error));
db.once("open" , ()=> console.log("Connected to Database"));

// Middlewares
app.use(express.json());

const PsychometricTestRoute = require("./routes/sycomatric");
app.use("/psychometric-test", authmiddleware, adminmiddleware, PsychometricTestRoute);
// protected Route Prefix 
app.use("/auth", authroute);
app.use("/roles" ,  authmiddleware, adminmiddleware, rolesroute);
app.use("/users" ,  authmiddleware, adminmiddleware, userroute);
app.use("/group", authmiddleware, adminmiddleware, grouproute);
app.use("/task", authmiddleware, adminmiddleware, taskgroup);
app.use("/calender", authmiddleware, adminmiddleware, calandergroup);
app.use("/assesment", authmiddleware, adminmiddleware, assesmentroute);
app.use("/session", authmiddleware, adminmiddleware, sessionroute);
app.use("/grade", authmiddleware, adminmiddleware, graderoute);
app.use("/assignment", authmiddleware, adminmiddleware, assignmentRoute); 
app.use("/document", authmiddleware, adminmiddleware,documentRoute)
app.use("/folder", authmiddleware, adminmiddleware, folderRoute);

app.get("/auth/role", authmiddleware, (req, res) => {
  try {
    const { role, id } = req.userData;    
    // Customize the response based on the user's role
    if (role === "admin") {
      return res.status(200).json({ message: "Welcome to the Admin Dashboard!" });
    } else if (role === "student") {
      return res.status(200).json({ message: "Welcome to the Student Dashboard!" });
    } else {
      return res.status(403).json({ message: "Forbidden, unknown role" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.listen(port , ()=> {
    console.log(`Server is running on http://localhost:${port}`);
});
