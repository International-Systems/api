const db = require('./database');
let pool = db.createPool();




module.exports = {
    upsert: async (ticket, cut, seq, bundle, buncut, style, opstyseq, operation, section, quantity, standard, color, width, size, date, empnum, category, stdtime, time, shade, numempl, tkttime) => {
        return await upsert(ticket, cut, seq, bundle, buncut, style, opstyseq, operation, section, quantity, standard, color, width, size, date, empnum, category, stdtime, time, shade, numempl, tkttime);
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


async function upsert(ticket, cut, seq, bundle, buncut, style, opstyseq, operation, section, quantity, standard, color, width, size, date, empnum, category, stdtime, time, shade, numempl, tkttime) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.ticket (ticket, cut, seq, bundle, buncut, style, opstyseq, operation, section, quantity, standard, color, width, size, date, empnum, category, stdtime, \"time\", shade, numempl, tkttime) "
            + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22);";
        let values = [ticket, cut, seq, bundle, buncut, style, opstyseq, operation, section, quantity, standard, color, width, size, date, empnum, category, stdtime, time, shade, numempl, tkttime];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function clear() {
    return new Promise(async (resolve) => {
        let sqlQuery = "DELETE FROM public.ticket;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function get(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.ticket WHERE ticket = $1 LIMIT 1;";
        let values = [value];
        const bundle = await db.execute(pool, sqlQuery, values);
        try {
            resolve(bundle[0]);
        } catch (error) {
            resolve(bundle);
        }
    });
}


async function getAll() {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.ticket ORDER BY bundle, opstyseq;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function insertJSON(json) {
    return new Promise(async (resolve) => {
        let sqlQuery = `with aux_json (doc) as (values ('${JSON.stringify(json)}'::json)) ` + 
        "INSERT INTO public.ticket(ticket, cut, seq, bundle, buncut, style, opstyseq, operation, section, quantity, standard, color, width, size, date, empnum, category, stdtime, \"time\", shade, numempl, tkttime)" +
        " select p.* from aux_json l cross join lateral json_populate_recordset(null::ticket, doc) as p"

        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}