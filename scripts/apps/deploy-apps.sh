#!/bin/bash

APPS_SCRIPTS_DIR=$PWD/scripts/apps

. $APPS_SCRIPTS_DIR/backend.sh

dfx deploy internet-identity
