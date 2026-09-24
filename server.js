require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is working on port 3000")
        })
    })
    .catch(() => {
        process.exitCode = 1
    })