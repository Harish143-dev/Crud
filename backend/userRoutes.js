const database = require("./connect.js");
const express = require("express");
const ObjectId = require("mongodb").ObjectId;

let userRoutes = express.Router();

userRoutes.route("/users").get(async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").find({}).toArray();

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ error: "No data found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

userRoutes.route("/user/:id").get(async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: "No data found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// create a user
userRoutes.route('/users').post(async (req, res) => {
    try {
        let db = database.getDb()
        let mongoObject = {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            city: req.body.city,
        }
        let data = await db.collection("users").insertOne(mongoObject)
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// update user 
userRoutes.route('/users/:id').put(async (req, res) => {   // ✅ req, res (not res, req)
    try {
        let db = database.getDb()
        let mongoObject = {
            $set: {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                city: req.body.city,
            }
        }
        let data = await db.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },  // ✅ req.params.id (not res.params.id)
            mongoObject
        )

        // ✅ return a clear response
        res.json({ message: "User updated successfully", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// delete user 4

userRoutes.route("/users/:id").delete(async (req, res) => {
    try {
        let db = database.getDb();

        const result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = userRoutes;
