var xlsx = require('node-xlsx');
var program = require('commander');
var fs = require('fs');

var convlist = require('./convlist.json');
//console.log(convlist.server);
//console.log(convlist.client);

var wOption = {
  //flags: 'a',
  //encoding: 'utf-8',
  //mode: 0666   
};

var getSheetData = function(sheets,name){
    var data = {};
    sheets.forEach(function(sheet){
        if(sheet.name == name){
            data = sheet.data;
        }
    });
    return data;
};

var filterData = function (data,meta){
    //console.log(data);
    //console.log(meta);
    var cols = {};
    var keys = Object.keys(meta);
    for(var i = 0 ; i < data[0].length ; i++){
        for(var j = 0 ; j < keys.length ; j++){
            if(data[0][i].value == keys[j]){
                cols[keys[j]] = i;
                break;
            }
        }
    }

    var realdata = [];
    for(var i = 1; i < data.length; i++){
        var row = {};
        Object.keys(cols).forEach(function(ck){
            if(meta[ck] == 'Number'){
                row[ck] = Number(data[i][cols[ck]].value);
            }
            else if(meta[ck] == 'String'){
                row[ck] = String(data[i][cols[ck]].value);
            }
            else{
                row[ck] = data[i][cols[ck]].value;
            }
            
        });
        realdata.push(row);
    }
    return realdata;
};

var ServerExport = function(key){
    console.log('Server Export! key is ' + key);

    var convparam = convlist.server[key];
    if(!!convparam){
        var xlsxFile = xlsx.parse('./xlsx/'+convparam.xlsx);
        //console.log(xlsxFile);
        var data = getSheetData(xlsxFile.worksheets,convparam.sheet);
        //console.log(data);
        if(!data){
            console.error('sheet in file not found');
            return;
        }
        var meta = require('./server/meta/'+convparam.meta);
        console.log(meta);

        var realdata = filterData(data,meta);
        console.log(realdata);
        var buff = new Buffer(JSON.stringify(realdata));
        var fileWriteStream = fs.createWriteStream('./server/res/'+convparam.res,wOption);
        fileWriteStream.on("error", function(err) { 
            console.error("Server Export write file error!");
            console.error(err);
        }); 
        fileWriteStream.write(buff);
    }
};

var ClientExport = function(key){
    //var obj = xlsx.parse(__dirname + '/xlsx/test.xlsx');
    //console.log(obj.worksheets[0].data); 
    console.log('client Export!');

    var convparam = convlist.client[key];
    if(!!convparam){
        var xlsxFile = xlsx.parse('./xlsx/'+convparam.xlsx);
        //console.log(xlsxFile);
        var data = getSheetData(xlsxFile.worksheets,convparam.sheet);
        //console.log(data);
        if(!data){
            console.error('sheet in file not found');
            return;
        }
        var meta = require('./client/meta/'+convparam.meta);
        //console.log(meta);

        var realdata = filterData(data,meta.entry);
        console.log(realdata);
    
        var protobuf = require('pomelo-protobuf');
        var resProto = protobuf.parse(meta.proto);
        console.log(resProto);
        protobuf.init({encoderProtos:resProto, decoderProtos:resProto});
        var encode = {};
        encode[convparam.proto] = realdata;
        var buf = protobuf.encode(convparam.proto,encode);
        console.log(buf);

        var fileWriteStream = fs.createWriteStream('./client/res/'+convparam.res,wOption);
        fileWriteStream.on("error", function(err) { 
            console.error("Server Export write file error!");
            console.error(err);
        }); 
        fileWriteStream.write(buf);

        var dec = protobuf.decode("test",buf);
        console.log("decode:");
        console.log(dec);
    }    
};

var list = function(val){
    return val.split(',');
};

program
  .version('0.0.1')
  .option('-s, --server [value]', 'export server res', list)
  .option('-c, --client [value]', 'export client res', list)
  .option('-a, --all [value]', 'export all res')
  .parse(process.argv);

if(program.server){
    if(program.server === true){
        program.server = Object.keys(convlist.server);
    }
    console.log(program.server);

    program.server.forEach(function(key){
        ServerExport(key);
    });
   
}

if(program.client){
    if(program.client === true){
        program.client = Object.keys(convlist.client);
    }
    console.log(program.client);

    program.client.forEach(function(key){
        ClientExport(key);
    });
}

if(program.all){
    Object.keys(convlist.server).forEach(function(key){
        ServerExport(key);
    });
    
    Object.keys(convlist.client).forEach(function(key){
        ClientExport(key);
    });
}



