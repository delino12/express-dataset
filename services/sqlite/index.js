const Sequelize = require('sequelize');
const path = require('path');
const dbPath = path.resolve(__dirname, 'test.sqlite');

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  storage: dbPath,
  operatorsAliases: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.info('Database connection established');
  })
  .catch((err) => {
    console.error('Unable to connect to database', err);
  });

sequelize.sync()
  .then(() => {
    console.info('Tables created successfully.');
  })
  .catch((err) => {
    console.info('Error', err);
  });
module.exports = sequelize;
