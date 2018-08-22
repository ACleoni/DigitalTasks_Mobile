require('../models').sequelize.sync({force: true}).then(() => process.exit()).catch(e => console.log(e));

