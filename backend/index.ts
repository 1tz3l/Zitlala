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
