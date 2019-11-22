const db = require('./database');
let pool = db.createPool();


module.exports = {
    upsert: async (operation, description, standard, category, time, issect, skill, descripti2, numcode, maquina, ph, seq, observns, descripti3) => {
        return await upsert(operation, description, standard, category, time, issect, skill, descripti2, numcode, maquina, ph, seq, observns, descripti3);
    },
    clear: async () => {
        return await clear();
    },
    get: async (value) => {
        return await get(value);
    },
    getAll: async () => {
        return await getAll();
    },
    insertJSON: async(json) => {
        return await insertJSON(json);
    }
}


async function upsert(operation, description, standard, category, time, issect, skill, descripti2, numcode, maquina, ph, seq, observns, descripti3) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.operation (operation, description, standard, category, \"time\", issect, skill, descripti2, numcode, maquina, ph, seq, observns, descripti3) "
            + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);";
        let values = [operation, description, standard, category, time, issect, skill, descripti2, numcode, maquina, ph, seq, observns, descripti3];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function clear() {
    return new Promise(async (resolve) => {
        let sqlQuery = "DELETE FROM public.operation;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function get(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.operation WHERE operation = $1 LIMIT 1;";
        let values = [value];
        const operation = await db.execute(pool, sqlQuery, values);
        try {
            resolve(operation[0]);
        } catch (error) {
            resolve(operation);
        }
    });
}


async function getAll() {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.operation;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}



async function insertJSON(json) {
    return new Promise(async (resolve) => {
        let sqlQuery = `with aux_json (doc) as (values ('${JSON.stringify(json)}'::json)) ` + 
        "INSERT INTO public.operation (operation, description, standard, category, \"time\", issect, skill, descripti2, numcode, maquina, ph, seq, observcns, descripti3)" +
        " select p.* from aux_json l cross join lateral json_populate_recordset(null::operation, doc) as p"
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}