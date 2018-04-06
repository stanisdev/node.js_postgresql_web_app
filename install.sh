#!/bin/bash
npm i
./node_modules/.bin/sequelize db:migrate
echo "Now you can run app by typing 'npm start'"
