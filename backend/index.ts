import { ic } from "azle";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { Server } from "azle";

import { CreateServer } from "./server";

/**
 * Polify BigInt.toJSON for react-native
 * @returns {number}
 */
declare global {
  interface BigInt {
    toJSON(): number;
  }
}

BigInt.prototype.toJSON = function () {
  return Number(this.toString());
};

export default Server(CreateServer, {});


import { Database } from "./database";

    async function CreateApp() {
    const database = new Database();
    await database.init();
    await database.migrate();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(async (req, res, next) => {
        req.database = database;
        next();
    });

    app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
        console.error(err.message);
        res.status(500).send("Something broke!");
    });

    function AuthGuard(req: Request, res: Response, next: NextFunction) {
        if (ic.caller().isAnonymous()) {
        res.status(401);
        res.send("You are not authorized to access this resource.");
        } else {
        next();
        }
    }

    app.get("/health", (req, res) => {
        res.send().statusCode = 204;
    });

    app.post("/users", AuthGuard, (req, res) => {
        const principal = ic.caller().toString();
        const { username, bio } = req.body;

        const result = req.database.exec(`
        INSERT INTO users (principal, username, bio) 
        VALUES ('${principal}', '${username}', '${bio}')
        `);

        res.json(result);
    });

    app.get("/users", AuthGuard, (req, res) => {
        const { principal } = req.query;

        try {
        const result = req.database.exec(`
            SELECT * FROM users WHERE principal = '${principal}'
        `);
        res.json(result);
        } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching users.");
        }
    });

    //Endpoints game

    app.post("/furniture", AuthGuard, (req, res) => {

        const { background, window, bookcase, bed, chair, tableItem } = req.body;

        const result = req.database.exec(`
        INSERT INTO furniture (background, window, bookcase, bed, chair, tableItem) VALUES ('${background}', '${window}', '${bookcase}', '${bed}', '${chair}', '${tableItem})')`);

        res.json(result);
    });

    app.get("/furniture", AuthGuard, (req, res) => {
        try {
            const result = req.database.exec(`SELECT * FROM furniture`);
            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).send( "An error ocurred while fetching objects"  
            );
        };
    });


    app.post("/clothes", AuthGuard, (req, res) => { 
            
        const { head, ears, back, chest, shoes, mouth, butt } = req.body;

        const result = req.database.exec(`
        INSERT INTO clothes (head, ears, back, chest, shoes, mouth, butt) VALUES ('${head}', '${ears}', '${back}', '${chest}', '${shoes}', '${mouth}', '${butt})')`);

        res.json(result);
    });

    app.get("/clothes", AuthGuard, (req, res) => {
        try {
            const result = req.database.exec(`SELECT * FROM clothes`);
            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).send( "An error ocurred while fetching objects"  
            )
        }
     });

    app.post("/food", AuthGuard, (req, res) => {

        const { fruit, vegetable, meat, dessert, drink } = req.body;

        const result = req.database.exec(`INSERT INTO food (fruit, vegetable, meat, dessert, drink) VALUES ('${fruit}', '${vegetable}', '${meat}', '${dessert}', '${drink})')`);
    });

    app.get("/food", AuthGuard, (req, res) => {
        try {
            const result = req.database.exec(`SELECT * FROM food`);
            res.json(result);
        }
        catch (error) {
            console.error(error);
            res.status(500).send( "An error ocurred while fetching objects"  
            )
        }
    });

    // Database
    app.get("/database/migrations", AuthGuard, async (req, res) => {
        const result = await req.database.exec(`SELECT * FROM migrations`);
        res.json(result);
    });

    app.get("/database/tables", AuthGuard, async (req, res) => {
        const result = await req.database.exec(`SELECT name FROM sqlite_master WHERE type='table'`);
        res.json(result);
    });

    app.listen();
    }

    CreateApp();
