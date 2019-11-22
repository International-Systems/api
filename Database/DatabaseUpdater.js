const ReadDBF = require("./ReadDBF");
const fs = require('fs');

const bundleDAO = require('./DAO/bundle');
const ticketDAO = require('./DAO/ticket');
const operationDAO = require('./DAO/operation');
const employeeDAO = require('./DAO/employee');

let tables = [
    {
        name: "Ticket",
        lstUpdate: 0,
        dao: ticketDAO
    },
    {
        name: "Employee",
        lstUpdate: 0,
        dao: employeeDAO
    },
    {
        name: "Operation",
        lstUpdate: 0,
        dao: operationDAO
    },
    {
        name: "Bundle",
        lstUpdate: 0,
        dao: bundleDAO
    },
];


const getFileUpdatedDate = (path) => {
    const stats = fs.statSync(path);
    return stats.mtime
}

module.exports = {
    test: () => {
        bundleDAO.clear();
    },
    update: () => {
        tables.forEach(async t => {
            if (getFileUpdatedDate(__dirname + `/Storage/${t.name}.DBF`) > t.lstUpdate) {
                this.tblReader = new ReadDBF(t.name);

                const tbl = await this.tblReader.load();
                console.log(`--------UPDATING DB------------${t.name}-----------------------------`);
                await t.dao.clear();

                let values = [];
                for (let i = 0; i < tbl.length; i++) {
                    let obj = tbl[i];
                    let objFormat = {};
                    let objParams = [];
                    Object.keys(obj).forEach(function (key, index) {
                        if (key.length > 0 & key.indexOf(".dbc") <= 0) {
                            //CHECK IF VALUE FROM DBF FILE IS VALID
                            //---EXCLUDE NaN values - "Not a Number" in number fields
                            //---Replace to delete all invalid characteres to UTF-8
                            let val = null;
                            if (obj[key]) {
                                val = obj[key].toString() == "NaN" ? 0 : obj[key].toString().replace(/[^\x20-\x7E]+/g, '').replace(/'\w*/g, "''");
                            }

                            //CHANGE IF NAME IS DIFFERENT
                            let keyV = key.toLocaleLowerCase() == "descriptio" ? "description" : key.toLocaleLowerCase();
                            objFormat[keyV] = val;
                            objParams.push(val);
                        }
                    });
                    values.push(objFormat);
                    // try {
                    //     await t.dao.upsert(...objParams);
                    // } catch (e) {
                    //     console.log(e);
                    // }

                }

                t.dao.insertJSON(values);
                t.lstUpdate = (new Date()).getTime();
                console.log(`-${t.lstUpdate}-------UPDATED DB------------${t.name}-----------------------------`);
            }
        });


    }

}
