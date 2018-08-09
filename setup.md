##Setup: Run the following commands

1. npm install
    * install node modules
2. node ./test/util/setup.js
    * creates test database according to config/config.js.
3. node_modules/.bin/sequelize db:create
    * creates development, production, or test db according to NODE_ENV environment variable