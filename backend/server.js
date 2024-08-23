const express = require("express");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;
const { logger, logEvents } = require("./middleware/logger");
const cors = require('cors');

app.use(logger);
app.use('/', express.static(path.join(__dirname, '/public')));
app.use("/", require("./routes/root"));
app.use(express.json());
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

// const mongoose = require("mongoose");

// require("dotenv").config();


// app.use(cors());



// // console.log(process.env.NODE_ENV);

// const uri = process.env.DATABASE_URI;

// mongoose.connect(
//     uri,
//     { 
//         useNewUrlParser: true, 
//         useCreateIndex: true 
//     }
// );

// // mongoose.connection.on("error", (err) => {
// //     console.log(err);

// // });

// const connection = mongoose.connection;
// connection.once("open", () => {
//     console.log("You are connected to MongoDB");
// });
