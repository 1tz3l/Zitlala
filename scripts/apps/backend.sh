#!/bin/bash

export CKBTC_LEDGER_CANISTER_ID=$(dfx canister id ckbtc-ledger)
export CKBTC_MINTER_CANISTER_ID=$(dfx canister id ckbtc-minter)

dfx deploy backend
