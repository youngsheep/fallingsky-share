var fs = require('fs');

var gensrc = module.exports;

gensrc.generate = function(name,key,meta,proto){
    console.log("generate:"+name) ;
    //gen filed
    var key_type = "";
    var field = "";
    var field_parser = "";
    Object.keys(meta).forEach(function(k){
        field_parser += 'enti.'+k + ' = jsonEntity["'+k+'"].';
        if(meta[k] == "sInt32"){
            field += "int ";
            field_parser += "as_integer();\n    ";
            if(key == k){
                key_type = "int";
            } 
        }
        else if(meta[k] == "string"){
            field += "std::string ";
            field_parser += "as_string();\n    ";
            if(key == k){
                key_type = "std::string";
            }             
        }
        else{
            field += "int ";
            field_parser += "as_integer();\n    ";
            if(key == k){
                key_type = "int";
            } 
        }

        field += k + "; \n    ";
    });

    console.log(field);

    var tmpl_h = String(fs.readFileSync('./client/src.h.tmpl'));
    tmpl_h = tmpl_h.replace(/\$\{NAME\}/g , name);
    tmpl_h = tmpl_h.replace(/\$\{KEY_FIELD\}/g,key);
    tmpl_h = tmpl_h.replace(/\$\{FILED\}/g,field);
    tmpl_h = tmpl_h.replace(/\$\{KEY_TYPE\}/g,key_type);
    //console.log(tmpl_h);

    fs.writeFileSync('./client/srcgen/'+name+"ConfigHolder.h",new Buffer(tmpl_h));

    var tmpl_cpp = String(fs.readFileSync('./client/src.cpp.tmpl'));
    tmpl_cpp = tmpl_cpp.replace(/\$\{NAME\}/g , name);
    tmpl_cpp = tmpl_cpp.replace(/\$\{PROTO\}/g , JSON.stringify(proto).replace(/\"/g,'\\\"'));
    tmpl_cpp = tmpl_cpp.replace(/\$\{FILED_PARSER\}/g , field_parser);
    console.log(tmpl_cpp);

    fs.writeFileSync('./client/srcgen/'+name+"ConfigHolder.cpp",new Buffer(tmpl_cpp));
};

gensrc.convertMeta = function(proto){
    var meta = {};
    Object.keys(proto['message Entry']).forEach(function(key){
        var split = key.split(' ');
        console.log(split);
        meta[split[2]] = split[1];
    });
    
    return meta;
};


