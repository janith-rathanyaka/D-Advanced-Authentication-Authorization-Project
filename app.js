const express  = require("express");
const mongoose = require("mongoose");

const router = require("./routes/user-routes");

const app = express();
app.use(express.json());
app.use("/api", router);

mongoose.connect("mongodb+srv://admin:LRUFX3piZToV6Oiu@cluster0.tnlwi.mongodb.net/auth?retryWrites=true&w=majority").then(() => {
    app.listen(5000);
    console.log("Database is connected!")
}).catch((err) => console.log(err));


// LRUFX3piZToV6Oiu