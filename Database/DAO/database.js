const { Pool } = require('pg')


const dbConfig = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: true
}


module.exports = {
  createPool: () => new Pool(dbConfig),
  execute: async function (pool, sqlQuery, values){
    return new Promise(resolve => {
       let rowsReturn = [];
        pool.connect()
        .then(client => {
            return client.query(sqlQuery, values)
            .then(res => {
                rowsReturn = res.rows;
                client.release();
            })
            .catch(e => {
                console.log(e);
                rowsReturn = e;
                client.release();
            })
            .then(() => resolve(rowsReturn));
        });
    });
  }
}


