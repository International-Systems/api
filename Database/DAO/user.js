const db = require('./database');
let pool = db.createPool();


module.exports = {
    upsertUser: async (username, firstname, lastname, email, password, auth_method_id) => {
        return await upsertUser(username, firstname, lastname, email, password, auth_method_id);
    },
    getUserLogin: async (value) => {
        return await getUserLogin(value);
    },
    auth: async (username, password) => {
        return (await auth(username, password)) > 0;
    }
    
}


async function upsertUser(username, firstname, lastname, email, password, auth_method_id) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.user (username, password) "
            + " VALUES ($1, $2)  ON CONFLICT (username) DO UPDATE "
            + " SET password = $2";
        let values = [username, password];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function getUserLogin(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.user WHERE username = $1 LIMIT 1;";
        let values = [value];
        const user = await db.execute(pool, sqlQuery, values);
        try {
            resolve(user[0]);
        } catch (error) {
            resolve(user);
        }
    });
}



    async function auth(username, password) {
        return new Promise(async (resolve) => {
            let sqlQuery = "SELECT COUNT(*) FROM public.user WHERE username = $1 AND password = $2;";
            let values = [username, password];
            console.log(values);
            const result = await db.execute(pool, sqlQuery, values);
            console.log(result);
            try {
                resolve(result[0].count);
            } catch (error) {
                resolve(error);
            }
        });
}
