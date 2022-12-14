const db = require('./db');

const getConnection = async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (err) {
    console.error('Unable to connect to the database.', err);
  }
};

module.exports = getConnection;
