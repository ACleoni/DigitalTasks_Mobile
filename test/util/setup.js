const { username, password, database, host } = require('../../config/config').database.test;
const { Client } = require('pg');
const models = require('../../models');

(() => {
    return new Promise((resolve, reject) => {
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
            await models.sequelize.close();
            resolve();
        })()
        .catch((e) => {
            reject(e);
        });
    });
})();