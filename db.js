const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@51harmandeep",   
    database: "student_app_db"
});

db.connect((err) => {
    if(err){
        console.log("DB connection failed ❌", err);
    } else {
        console.log("MySQL Connected Successfully ✅");
    }
});

module.exports = db;
