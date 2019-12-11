const db = require('./database');
let pool = db.createPool();


module.exports = {
    upsert: async (empnum, clocknum, empdept, firstname, lastname, address1, address2, city, state, zip, phone, social, worknum, workdate, doctype, paytype, sex, marital, exemptions, rate, specrate, hiredate, termdate, salary, birthday, workmancom, line, xrate, modular, lasttop) => {
        return await upsert(empnum, clocknum, empdept, firstname, lastname, address1, address2, city, state, zip, phone, social, worknum, workdate, doctype, paytype, sex, marital, exemptions, rate, specrate, hiredate, termdate, salary, birthday, workmancom, line, xrate, modular, lasttop);
    },
    clear: async () => {
        return await clear();
    },
    get: async (value) => {
        return await get(value);
    },
    getEarnings: async (value) => {
        return await getEarnings(value);
    },
    getAll: async () => {
        return await getAll();
    },
    insertJSON: async(json) => {
        return await insertJSON(json);
    },
    updateConfig: async(employee) =>{
        return await updateConfig(employee);
    }
}
async function updateConfig(employee){
   
    return new Promise(async (resolve) => {
        let sqlQuery = "UPDATE public.employee_config " 
        + " SET start_time=$2, finish_time=$3, wk_goal=$4, timezone=$5 "
        + " WHERE empnum=$1;";
        const {empnum, start_time, finish_time, wk_goal, timezone} = employee;
        let values = [empnum, start_time, finish_time, wk_goal, timezone ];
        console.log(values);
        resolve(await db.execute(pool, sqlQuery, values));
    });



    
}

async function upsert(empnum, clocknum, empdept, firstname, lastname, address1, address2, city, state, zip, phone, social, worknum, workdate, doctype, paytype, sex, marital, exemptions, rate, specrate, hiredate, termdate, salary, birthday, workmancom, line, xrate, modular, lasttop) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.employee (empnum, clocknum, empdept, firstname, lastname, address1, address2, city, state, zip, phone, social, worknum, workdate, doctype, paytype, sex, marital, exemptions, rate, specrate, hiredate, termdate, salary, birthday, workmancom, line, xrate, modular, lasttop) "
            + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30);";
        let values = [empnum, clocknum, empdept, firstname, lastname, address1, address2, city, state, zip, phone, social, worknum, workdate, doctype, paytype, sex, marital, exemptions, rate, specrate, hiredate, termdate, salary, birthday, workmancom, line, xrate, modular, lasttop];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function clear() {
    return new Promise(async (resolve) => {
        let sqlQuery = "DELETE FROM public.employee;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function get(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.get_employee WHERE empnum = $1 LIMIT 1;";
        let values = [value];
        const obj = await db.execute(pool, sqlQuery, values);
        if(obj.length > 0){
            try {
                resolve(obj[0]);
            } catch (error) {
                resolve(obj);
            }
        }else{
            resolve({});
        }
       
    });
}


async function getEarnings(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.employee_date_earn WHERE empnum = $1 ORDER BY date DESC LIMIT 7;";
        let values = [value];
        const obj = await db.execute(pool, sqlQuery, values);
        resolve(obj);
       
    });
}

async function getAll() {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.employee;";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function insertJSON(json) {
    return new Promise(async (resolve) => {
        let sqlQuery = `with aux_json (doc) as (values ('${JSON.stringify(json)}'::json)) ` + 
        "INSERT INTO public.employee (empnum, clocknum, empdept, firstname, lastname, address1, address2, city, state, zip, phone, social, worknum, workdate, doctype, paytype, sex, marital, exemptions, rate, specrate, hiredate, termdate, salary, birthday, workmancom, line, xrate, modular, lasttop)" +
        " select p.* from aux_json l cross join lateral json_populate_recordset(null::employee, doc) as p"

        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}