const db = require('./database');
let pool = db.createPool();


module.exports = {
    start: async (empnum, ticket) => {
        return await start(empnum, ticket);
    },
    finish: async (empnum, ticket) => {
        return await finish(empnum, ticket);
    },
    clear: async () => {
        return await clear();
    },
    getByEmpnum: async (empnum) => {
        return await getByEmpnum(empnum);
    },
    getByTicket: async (ticket) => {
        return await getByTicket(ticket);
    },
    getAll: async () => {
        return await getAll();
    },
    getEfficiency: async (empnum, ticket) => {
        return await getEfficiency(empnum, ticket);
    }
}


async function start(empnum, ticket, start_time) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.scans (empnum, ticket, start_time) "
            + " VALUES ($1,$2,current_timestamp);";
        let values = [empnum, ticket];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function finish(empnum, ticket) {
    return new Promise(async (resolve) => {
        let sqlQuery = "UPDATE public.scans SET  end_time=current_timestamp"
            + " WHERE empnum = $1 AND ticket = $2;";
        let values = [empnum, ticket];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function clear() {
    return new Promise(async (resolve) => {
        let sqlQuery = "DELETE FROM public.scans;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function getByEmpnum(empnum) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.scans WHERE empnum = $1;";
        let values = [empnum];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}
async function getByTicket(ticket) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.scans WHERE ticket = $1 LIMIT 1;";
        let values = [ticket];
        const scans = await db.execute(pool, sqlQuery, values);
        try {
            resolve(scans[0]);
        } catch (error) {
            resolve(scans);
        }
    });
}

async function getEfficiency(empnum, ticket) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.scans_efficiency WHERE empnum = $1 AND ticket = $2 LIMIT 1;";
        let values = [empnum, ticket];
        const scans = await db.execute(pool, sqlQuery, values);
       

        try {
            resolve(scans[0]);
        } catch (error) {
            resolve(scans);
        }
    });
}

async function getAll() {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.scans;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}