import fs from "fs";
import express from "express";
import mysql, {MysqlError} from "mysql";


const page = (fs.readFileSync("./public/index.html").toString());
const app = express();

app.get("/", (request, response) => {
    response.send(page);
});
app.get("/:arg0", (request, response) => {
    if (request.params.arg0 != "api") response.send(page);
});
app.use(express.static(process.cwd() + "\\dist")); // Serve static files
app.listen(80); // Listen on port 80

const db = mysql.createConnection({
    host: "localhost",
    user: "joaoSchoolAdminA3",
    password: "school",
    port: 3306,
    database: "school_admin_a3",
    insecureAuth: true
});

function escapeQuotes(str: string): string {
    return (str.replace("'", "\\'").replace('"', '\\"'));
}

function query(statement: string, handler: (error: Error | null, result: any) => void): void {
    db.query(statement, function(queryError: MysqlError | null, result: any) {
        if (queryError) handler(new Error(queryError.message), null);
        else {
            while (!result);
            handler(null, result);
        }
    });
}


// Student api:
app.get("/api/get-all-students", (request, response) => {
    query("SELECT * FROM student", (error, result) => {
        if (error) response.send(error);
        else response.send((result as any []).map(i => ({id: i.id, firstName: i.first_name, lastName: i.last_name}))); // TODO: Fix names!!!!
    });
});