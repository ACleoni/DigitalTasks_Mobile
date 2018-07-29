const { username, password, database, host } = require('../../config/config').test;
const { Client } = require('pg');
/* Set env to 'test' prior to syncing schema */
process.env.NODE_ENV = "test";
const models = require('../../models');
const ENV = process.env.NODE_ENV || 'development';

/* Attempt to connect to test database */
const clientPrimary = new Client({
    user: username,
    host,
    database,
    password,
  });
/* Connect to postgres if test database does not exist */
const clientSecondary = new Client({
    user: username,
    host,
    password
});

(async () => {
    try {
        await clientPrimary.connect();
        clientPrimary.end();
    } catch (e) {
        if (e.toString().includes('does not exist')) {
            await clientSecondary.connect();
            await clientSecondary.query(`CREATE DATABASE ${database}`);
            await clientSecondary.end();
        }
    }
    await models.sequelize.sync({force: true});
    /* Reset env to previous setting */
    process.env.NODE_ENV = ENV;
    process.exit(0);
})()
.catch((e) => {
    process.exit(1);
});
