const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");

// JSON data allow karna
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public folder ko access dena
app.use(express.static(path.join(__dirname, "public")));

// home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================= REGISTER API =================
app.post("/register", async (req, res) => {

    const {
        name,
        isd,
        email,
        address,
        pincode,
        city,
        state,
        country,
        dob,
        username,
        password,
        confirmPassword
    } = req.body;

// ===== SANITIZATION =====
const cleanName = name ? name.trim() : "";
const cleanEmail = email ? email.trim().toLowerCase() : "";
const cleanUsername = username ? username.trim() : "";
const cleanPassword = password ? password.trim() : "";
const cleanConfirmPassword = confirmPassword ? confirmPassword.trim() : "";

const cleanAddress = address ? address.trim() : null;
const cleanCity = city ? city.trim() : null;
const cleanState = state ? state.trim() : null;
const cleanCountry = country ? country.trim() : null;

// ===== REQUIRED FIELD CHECK =====
if (!cleanName || !cleanEmail || !cleanUsername || !cleanPassword || !cleanConfirmPassword) {
    return res.status(400).json({
        success: false,
        message: "All required fields are mandatory ❌"
    });
}
    // ===== LENGTH VALIDATION =====
    if (cleanName.length < 4) {
        return res.status(400).json({
            success: false,
            message: "Name must be at least 4 characters ❌"
        });
    }

    if (cleanUsername.length < 4) {
        return res.status(400).json({
            success: false,
            message: "Username must be at least 4 characters ❌"
        });
    }

    if (cleanPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters ❌"
        });
    }

    if (cleanPassword !== cleanConfirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and Confirm Password must match ❌"
        });
    }

    // ===== HASH PASSWORD (VALIDATION KE BAAD) =====
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    // ===== DUPLICATE CHECK =====
    const checkSql = `
        SELECT * FROM students 
        WHERE email = ? OR username = ?
    `;

    db.query(checkSql, [cleanEmail, cleanUsername], (err, result) => {

        if (err) {
            console.log("DB Error ", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email or Username already exists"
            });
        }

        // ===== INSERT =====
        const sql = `
            INSERT INTO students 
            (name, isd, email, address, pincode, city, state, country, dob, username, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            cleanName,
            isd,
            cleanEmail,
            cleanAddress,
            pincode,
            cleanCity,
            cleanState,
            cleanCountry,
            dob,
            cleanUsername,
            hashedPassword
        ], (err, result) => {

            if (err) {
                console.log("DB Error ❌", err);
                return res.status(500).json({ message: "Database error" });
            }

            res.json({
                success: true,
                message: "Student Registered Successfully"
            });

        });
    });
});

app.put("/student/:id", (req, res) => {

    const id = req.params.id;
    const { name, email, city, username } = req.body;

    const cleanName = name ? name.trim() : null;
    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanCity = city ? city.trim() : null;
    const cleanUsername = username ? username.trim() : null;

    const sql = `
    UPDATE students
    SET name = ?, email = ?, city = ?, username = ?
    WHERE id= ?
    `;

    db.query(sql, [cleanName, cleanEmail, cleanCity, cleanUsername, id], (err, result)=> {
        if(err){
            console.log("Update Error", err);
            return res.status(500).json({
                success:false,
                message:"Update failed"
            });
        }

        res.json({
            success:true,
            message:"Student updated successfully"
        });
    });
});

// ===== GET ALL STUDENTS (SECURE VERSION) =====
app.get("/students", (req, res) => {

    const sql = `
    SELECT id, name, isd, email, address, pincode, city, state, country, dob, username, created_at
    FROM students
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log("Fetch Error ❌", err);
            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }

        res.json({
            success: true,
            students: result
        });

    });

});

    // server start
app.listen(1000, () => {
    console.log("Server running on http://localhost:1000");
});
