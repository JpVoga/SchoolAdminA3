import fs from "fs";
import express from "express";


const page = (fs.readFileSync("./public/index.html").toString());
const app = express();

app.get("/", (request, response) => {
    response.send(page);
});
app.get("/:arg0", (request, response) => {
    response.send(page);
});
app.use(express.static(process.cwd() + "\\dist")); // Serve static files
app.listen(80); // Listen on port 80