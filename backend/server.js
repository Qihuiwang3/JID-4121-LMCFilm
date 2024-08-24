require("dotenv").config();

const express = require("express");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");

// Connect to the database
connectDB();

// Middleware
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json()); 
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use("/", require("./routes/root"));
app.use("/students", require("./routes/studentsRoutes"));
app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
  
mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
});
