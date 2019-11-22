const Parser = require('node-dbf').default;
 

class ReadDBF {
    constructor(tableName) {
        
        this.parser = new Parser(__dirname + `/Storage/${tableName}.DBF`);     
        this.tableName = tableName;
    }
    
    load(){
       return new Promise((resolve, reject) =>{
            let table = [] ;
            this.parser.on('start', (p) => {
                console.log(this.tableName + ': dBase file parsing has started');
            });
             
            this.parser.on('header', (h) => {
                // console.log('dBase file header has been parsed');
            });
             
            this.parser.on('record', (record) => {
                delete record["@sequenceNumber"];
                delete record["@deleted"];
                table.push(record);
            });
             
            this.parser.on('end', (p) => {
                console.log(this.tableName + ': Finished parsing the dBase file');
                resolve(table);
            });
            this.parser.parse();
           
        });
    }

    createCSV(){
        
        const { execSync } = require('child_process');
        let stdout = execSync(`node-dbf convert ./Storage/${this.tableName}.DBF > ./Storage/${this.tableName}.CSV`);
    }

  }


module.exports = ReadDBF;

