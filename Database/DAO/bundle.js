const db = require('./database');
let pool = db.createPool();


module.exports = {
    upsert: async (cut, seq, bundle, bundlex, buncut, style, color, room_number, weight, width, size, quantity, firsttk, lasttk, shade, status, bundprinte, boxdate, box, fwidth, flength, adfabric, formula1, xtra1, xtra2, rs, fulln, pnl, rtn, rpt, oc) => {
        return await upsert(cut, seq, bundle, bundlex, buncut, style, color, room_number, weight, width, size, quantity, firsttk, lasttk, shade, status, bundprinte, boxdate, box, fwidth, flength, adfabric, formula1, xtra1, xtra2, rs, fulln, pnl, rtn, rpt, oc);
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
    importCSV: async (path) => {
        return await importCSV(path);
    },
    insertJSON: async(json) => {
        return await insertJSON(json);
    }
}


async function upsert(cut, seq, bundle, bundlex, buncut, style, color, room_number, weight, width, size, quantity, firsttk, lasttk, shade, status, bundprinte, boxdate, box, fwidth, flength, adfabric, formula1, xtra1, xtra2, rs, fulln, pnl, rtn, rpt, oc) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.bundle (cut, seq, bundle, bundlex, buncut, style, color, room_number, weight, width, size, quantity, firsttk, lasttk, shade, status, bundprinte, boxdate, box, fwidth, flength, adfabric, formula1, xtra1, xtra2, rs, fulln, pnl, rtn, rpt, oc) "
            + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31);";
        let values = [cut, seq, bundle, bundlex, buncut, style, color, room_number, weight, width, size, quantity, firsttk, lasttk, shade, status, bundprinte, boxdate, box, fwidth, flength, adfabric, formula1, xtra1, xtra2, rs, fulln, pnl, rtn, rpt, oc];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function clear() {
    return new Promise(async (resolve) => {
        let sqlQuery = "DELETE FROM public.bundle;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function get(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.bundle WHERE bundle = $1 LIMIT 1;";
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
        let sqlQuery = "SELECT * FROM public.bundle WHERE bundle in (SELECT bundle FROM public.ticket WHERE empnum IS NULL);";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function importCSV(path) {
    return new Promise(async (resolve) => {
        let sqlQuery = "COPY public.bundle FROM '" +  path + "' DELIMITER ',';";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function insertJSON(json) {
    return new Promise(async (resolve) => {
        let sqlQuery = `with aux_json (doc) as (values ('${JSON.stringify(json)}'::json)) ` + 
        "INSERT INTO public.bundle (cut, seq, bundle, bundlex, buncut, style, color, room_number, weight, width, size, quantity, firsttk, lasttk, shade, status, bundprinte, boxdate, box, fwidth, flength, adfabric, formula1, xtra1, xtra2, rs, fulln, pnl, rtn, rpt, oc)" +
        " select p.* from aux_json l cross join lateral json_populate_recordset(null::bundle, doc) as p"

        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}