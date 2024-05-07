import { Principal, ic } from "azle";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";

import { CkbtcLedger, CkbtcMinter } from "./ckbtc";
import { Database } from "./database";

export async function CreateServer() {
  const database = new Database();
  await database.init();

  const app = express();

  // Init ckBTC canisters
  const ckbtcLedger = new CkbtcLedger(Principal.fromText(process.env.CKBTC_LEDGER_CANISTER_ID!));
  const ckbtcMinter = new CkbtcMinter(Principal.fromText(process.env.CKBTC_MINTER_CANISTER_ID!));

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

  // Comprar skin
  app.post("/buy", AuthGuard, async (req, res) => {
    const principal = ic.caller();
    const { skinId, price } = req.body;
    const balance = await ckbtcLedger.getBalance(principal);

    const fee = 0.1;
    const totalPrice = price + fee;

    if (balance < totalPrice) {
      res.status(400).json({ error: "Insufficient funds" });
      return;
    }

    const result = req.database.exec(`
      INSERT INTO compras (skin_id, price) VALUES ('${skinId}', '${price}')
    `);

    const to = Principal.fromText("2vxsx-fae");

    await ckbtcLedger.transfer(principal, to, price);

    res.json({
      skinId,
      price,
    });
  });

  // ckBTC Endpoints

  app.post("/ckbtc/info", async (req: Request, res: Response) => {
    try {
      const principal = ic.caller();
      const address = await ckbtcMinter.getAddress(principal);
      await ckbtcMinter.updateBalance(principal);
      const balance = await ckbtcLedger.getBalance(principal);

      res.json({ address, balance });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ckbtcMinter: process.env.CKBTC_MINTER_CANISTER_ID,
        ckbtcLedger: process.env.CKBTC_LEDGER_CANISTER_ID,
        error,
      });
    }
  });

  app.post(
    "/ckbtc/transfer",
    async (req: Request<any, any, { to: string; amount: number }>, res: Response) => {
      const from = ic.caller();
      const to = Principal.fromText(req.body.to);

      try {
        const result = await ckbtcLedger.transfer(from, to, req.body.amount);

        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
    }
  );

  return app.listen();
}

  CreateServer();
