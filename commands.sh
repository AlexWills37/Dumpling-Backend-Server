#!/bin/bash

# Change directory to the location of the script
cd "$(dirname "$0")"

# Execute the nodejs file with the provided parameters
node ./scripts/commands.js "$@"