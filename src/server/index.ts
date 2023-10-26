import fs from "fs";
import express, { request, response } from "express";
import mysql, {MysqlError} from "mysql";
import {isError, isNameValid, nameMaxLength} from "../util";


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
        if (queryError) handler({name: "Erro", message: queryError.message}, null);
        else {
            while (!result);
            handler(null, result);
        }
    });
}


// Student api:
app.get("/api/get-all-students", (request, response) => {
    query("SELECT * FROM student", (error, result) => {
        if (error) response.send({name: "Erro", message: error.message});
        else response.send((result as any []).map(i => ({id: i.id, firstName: i.first_name, lastName: i.last_name})));
    });
});

app.get("/api/create-student", (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const firstName = url.searchParams.get("firstName") ?? "";
    const lastName = url.searchParams.get("lastName") ?? "";

    if ((!(isNameValid(firstName))) || (!(isNameValid(lastName)))) {
        response.send({name: "Erro", message: "Nome e sobrenome de aluno devem ter de 1 a " + nameMaxLength.toString() + " caracteres."});
        return;
    }

    query(`INSERT INTO student(first_name, last_name) VALUE("${escapeQuotes(firstName)}", "${escapeQuotes(lastName)}")`, (error, result) => {
        if (error) {
            response.send({name: "Erro", message: error.message});
            return;
        }

        query("SELECT MAX(id) AS \"id\" FROM student", (error1, result1) => {
            if (error1) {
                response.send({name: "Erro", message: error1.message});
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
        response.send({name: "Erro", message: "Impossível ler aluno sem ID."});
        return;
    }

    query(`SELECT * FROM student WHERE id = ${id}`, (error, result) => {
        if (error) {
            response.send({name: "Erro", message: error.message});
            return;
        }

        if ((result.length ?? 0) < 1) {
            response.send({name: "Erro", message: "Aluno não encontrado."});
            return;
        }

        response.send({id: result[0].id, firstName: result[0].first_name, lastName: result[0].last_name});
    });
});

app.get("/api/update-student", (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const id = parseInt(url.searchParams.get("id") ?? "");
    const firstName = url.searchParams.get("firstName") ?? "";
    const lastName = url.searchParams.get("lastName") ?? "";

    if (isNaN(id)) {
        response.send({name: "Erro", message: "Impossível atualizar aluno sem ID."});
        return;
    }

    if ((!(isNameValid(firstName))) || (!(isNameValid(lastName)))) {
        response.send("Nome e sobrenome de aluno devem ter de 1 a " + nameMaxLength.toString() + " caracteres.");
        return;
    }

    query(`UPDATE student SET first_name = "${escapeQuotes(firstName)}", last_name="${escapeQuotes(lastName)}" WHERE id = ${id}`, (error, result) => {
        if (error) response.send({name: "Erro", message: error.message});
        else response.send({id, firstName, lastName});
    });
});

app.get("/api/delete-student", (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const id = parseInt(url.searchParams.get("id") ?? "");

    query(`DELETE FROM student WHERE id = ${id}`, (error, result) => {
        if (error) response.send({name: "Erro", message: error.message});
        else response.send(null);
    });
});


// Test api:
app.get("/api/get-all-tests", (request, response) => {
    query("SELECT * FROM test", (error, result) => {
        if (error) response.send({name: "Erro", message: error.message});
        else response.send((result as any []).map(i => ({id: i.id, name: i.name})));
    });
});

app.get("/api/create-test", (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const name = url.searchParams.get("name") ?? "";

    if (!(isNameValid(name))) response.send({name: "Erro", message: "Nome de avaliação deve ter de 1 a " + nameMaxLength.toString() + " caracteres."});
    else {
        query(`INSERT INTO test(name) VALUE("${escapeQuotes(name)}")`, (error, result) => {
            if (error) {
                response.send({name: "Erro", message: error.message});
                return;
            }

            query("SELECT MAX(id) AS \"id\" FROM test", (error1, result1) => {
                if (error1) response.send({name: "Erro", message: error1.message});
                else response.send({id: result1[0]["id"], name});
            });
        });
    }
});

app.get("/api/read-test", (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const id = parseInt(url.searchParams.get("id") ?? "");

    query(`SELECT * FROM test WHERE id = ${id}`, (error, result) => {
        if (error) {
            response.send({name: "Erro", message: error.message});
            return;
        }

        if ((result.length ?? 0) < 1) {
            response.send({name: "Erro", message: "Avaliação não encontrada."});
            return;
        }

        response.send({id, name: result[0]["name"]});
    });
});

fetch("http://localhost/api/read-test?id=45").then(response => response.json().then(data=>console.log(isError(data))));