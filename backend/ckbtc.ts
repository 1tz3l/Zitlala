import { None, Principal, Some, float64, ic, nat, nat64, text } from "azle";
import { ICRC } from "azle/canisters/icrc";
import BigNumber from "bignumber.js";

import { Minter } from "../tokens/ckbtc-minter";
import { padPrincipalWithZeros } from "./utils";

export class CkbtcLedger {
  private ledger: typeof ICRC;

  constructor(private readonly canisterId: Principal) {
    this.ledger = ICRC(this.canisterId);
  }

  public toBitcoin(satoshis: nat): float64 {
    const bitcoins = new BigNumber(satoshis.toString()).dividedBy(100000000);
    return bitcoins.toNumber();
  }

  public toSatoshis(btcs: float64): nat {
    const satoshis = new BigNumber(btcs).times(100000000);
    return BigInt(satoshis.toString());
  }

  public async getBalance(subaccount: Principal): Promise<number> {
    const satoshis = await ic.call(this.ledger.icrc1_balance_of, {
      args: [
        {
          owner: ic.id(),
          subaccount: Some(padPrincipalWithZeros(subaccount.toUint8Array())),
        },
      ],
    });

    const btcs = this.toBitcoin(satoshis);

    return btcs;
  }

  public async transfer(from: Principal, to: Principal, amount: float64) {
    const satoshis = this.toSatoshis(amount);

    const result = await ic.call(this.ledger.icrc1_transfer, {
      args: [
        {
          from_subaccount: Some(padPrincipalWithZeros(from.toUint8Array())),
          to: {
            owner: ic.id(),
            subaccount: Some(padPrincipalWithZeros(to.toUint8Array())),
          },
          amount: satoshis,
          fee: None,
          memo: None,
          created_at_time: None,
        },
      ],
    });

    if (result.Err) {
      throw result.Err;
    }

    return result.Ok;
  }
}

export class CkbtcMinter {
  private minter: typeof Minter;

  constructor(private readonly canisterId: Principal) {
    this.minter = Minter(this.canisterId);
  }

  public async getAddress(subaccount: Principal): Promise<string> {
    const address = await ic.call(this.minter.get_btc_address, {
      args: [
        {
          owner: Some(ic.id()),
          subaccount: Some(padPrincipalWithZeros(subaccount.toUint8Array())),
        },
      ],
    });

    return address;
  }

  public async updateBalance(subaccount: Principal) {
    const result = await ic.call(this.minter.update_balance, {
      args: [
        {
          owner: Some(ic.id()),
          subaccount: Some(padPrincipalWithZeros(subaccount.toUint8Array())),
        },
      ],
    });

    return result;
  }

  public async toBtc(address: text, amount: nat64) {
    const result = await ic.call(this.minter.retrieve_btc, {
      args: [
        {
          address,
          amount,
        },
      ],
    });

    return result;
  }

  public async toBtcStatus(blockIndex: nat64) {
    const result = await ic.call(this.minter.retrieve_btc_status, {
      args: [{ block_index: blockIndex }],
    });

    return result;
  }
}
