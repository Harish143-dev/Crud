const connect = require("./connect.js");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./userRoutes.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.use(userRoutes)


app.listen(PORT, () => {

    try {
        connect.connectToServer()
        console.log(`server running on ${PORT}`)
    } catch (err) {
        console.log(err);
    }

})