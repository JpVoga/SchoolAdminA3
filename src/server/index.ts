import fs from "fs";
import express from "express";
import mysql, {MysqlError} from "mysql";
import {isNameValid, nameMaxLength} from "../util";


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

app.get("/api/create-student", (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const firstName = url.searchParams.get("firstName") ?? "";
    const lastName = url.searchParams.get("lastName") ?? "";

    if ((!(isNameValid(firstName))) || (!(isNameValid(lastName)))) {
        response.send("Nome e sobrenome de aluno devem ter de 1 a " + nameMaxLength.toString() + " caracteres.");
        return;
    }

    query(`INSERT INTO student(first_name, last_name) VALUE("${escapeQuotes(firstName)}", "${escapeQuotes(lastName)}")`, (error, result) => {
        if (error) {
            response.send(error);
            return;
        }

        query("SELECT MAX(id) AS \"id\" FROM student", (error1, result1) => {
            if (error1) {
                response.send(error1);
                return;
            }

            response.send({id: result1[0]["id"], firstName, lastName});
        });
    });
});

app.get("/api/read-student", (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const id = parseInt(url.searchParams.get("id") ?? "");

    if (isNaN(id)) {
        response.send(new Error("Can't read student without ID."));
        return;
    }

    query(`SELECT * FROM student WHERE id = ${id}`, (error, result) => {
        if (error) {
            response.send(error);
            return;
        }

        response.send({id: result[0].id, firstName: result[0].first_name, lastName: result[0].last_name});
    });
});