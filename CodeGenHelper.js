var fs = require('fs'); 
const mustache = require('mustache');
const path = require('path');
const chalk = require('chalk');


module.exports = class CodeGenHelper {

    static buildFileNameFromName(outputPath, requestName) {
        requestName = requestName.replaceAll('/', '_');
        return outputPath + `/${requestName}.json`
    }

    static buildMustacheHashFromEnvFile(env) {

        var resultHash = {};
        
        if (env) {
            env.values.forEach(function(value){
                resultHash[value.key] = value.value;
            });
            }
        //console.log("resultHash: " + JSON.stringify(resultHash));
        return resultHash;
    }

    static buildMockStubs(options, collection) {
        var templateContents = fs.readFileSync(options.mustache);
        var managerTemplateContents = fs.readFileSync(options.managerTemplate, 'utf8');
        var envContents = JSON.parse(fs.readFileSync(options.environment, 'utf8'));
        var collectionContents = fs.readFileSync(collection);
        var mustacheHash = this.buildMustacheHashFromEnvFile(envContents);
        collectionContents = this.fixPostmanCollectionTokensForHash(collectionContents, mustacheHash);
        var env_collection_combined = mustache.render(collectionContents.toString(), this.buildMustacheHashFromEnvFile(envContents));
        
        env_collection_combined =  this.addPathToHash(JSON.parse(env_collection_combined));
        env_collection_combined =  this.addLastPathToHash(env_collection_combined);
        env_collection_combined =  this.addLastHeaderToHash(env_collection_combined);
        console.log("final:") 

        env_collection_combined.item = this.fixVariableNamesForSwift(env_collection_combined.item);
        
        //console.log(templateContents.toString());
        //console.log(env_collection_combined.item);
        env_collection_combined.item = this.addHeaderResponsesToRequests(env_collection_combined.item, options.headers);
        env_collection_combined.item = this.markLastHeader(env_collection_combined.item);
        var combinedTemplateAndCollection = mustache.render(templateContents.toString(), env_collection_combined.item);
        //console.log(combinedTemplateAndCollection);
        var collectionName = this.getCollectionName(env_collection_combined);
        console.log(env_collection_combined.item);
        fs.writeFile(options.output + "/MockNetworkRequestManager+" + collectionName + "." + options.extension, combinedTemplateAndCollection, function (error) {
            if (error) { console.error("error writing output" + error); }
            console.log(chalk.green(`📼Saved MockNetworkRequestManager+${collectionName}.${options.extension} to ` + options.requestManager + "/MockNetworkRequestManager+" + collectionName + "." + options.extension + " 📼"));
        });

        fs.writeFile(options.output + "/MockNetworkRequestManager." + options.extension, managerTemplateContents, function (error) {
            if (error) { console.error("error writing output" + error); }
            console.log(chalk.green(`📼Saved MockNetworkRequestManager.${options.extension} to ` + options.output + "/MockNetworkRequestManager." + options.extension + "📼"));
        });
    }
    
    static getCollectionName(hash) {
        if (hash) {
            return hash.info.name;
        }
    }
    
    static addHeaderResponsesToRequests(hash, headers) {
        if (hash) {
            var index = 0;
            for (var item in hash) {
                hash[item].responseHeader = headers[index];
                index++;
            }
        }
        return hash;
    }
    
    static fixVariableNamesForSwift(hash) {
        if (hash) {
            for (var item in hash) {
                hash[item].name = hash[item].name.replaceAll('/', '');
                hash[item].name = hash[item].name.replaceAll('-', '');
            }
        }
        return hash;
    }
    
    static markLastHeader(hash) {
        if (hash) {
            for (var item in hash) {
                var headers = hash[item].responseHeader;
                if (headers.length > 0) {
                    for (var i in headers) {
                        console.log(headers[i].value);
                        headers[i].value = headers[i].value.replaceAll("\"", "'");
                        console.log(headers[i].value);
                        headers[i].last = false;
                    }
                    headers[headers.length-1].last = true;
                }
            }
        }
        return hash;
    }
    
    static fixPostmanCollectionTokensForHash(collection, hash) {
        if (hash) {
            Object.keys(hash).forEach(function(key) {
                try {
                    var possObj = hash[key];
                    if (typeof possObj == 'object') {
                        collection = collection.toString().replace('"{{' + key + '}}"', "{{" + key + "}}" );
                    }
                } catch (e) {
                    console.log(e);
                }
            });
        }
        return collection;
    }

    static addPathToHash(hash) {

        var items = hash.item;
        //console.log("addToPath: " + items);
        for (var i in items) {
            if (items[i].request != undefined) {
                if (items[i].request.url != undefined) { 
                    if (items[i].request.url.path != undefined) { 
                    // console.log("path strings: "+ items[i].request.url.path.join('/'));
                    items[i].request.url.joinedPath = "/" + path.join(items[i].request.url.path.join('/'));   
                }     
            }
        }
    }
        
        hash.item = items;
        // console.log("path components: " + hash);
        return hash;
    }
    
    static addLastPathToHash(hash) {
    
        var items = hash.item;
        // console.log("addToPath: " + items);
        for (var i in items) {
            if (items[i].request != undefined) { 
                if (items[i].request.url != undefined) { 
                    if (items[i].request.url.path != undefined) { 
                        // console.log("path strings: "+ items[i].request.url.path.join('/'))
                    }
                    items[i].last = items.length - 1 == i;
                }
            }
        }
        
        hash.item = items;
        //console.log("last: " + JSON.stringify(hash));
        return hash;
    }

    static addLastHeaderToHash(hash) {
    
        var items = hash.item;
        for (var i in items) {
            if (items[i].request != undefined) { 
                if (items[i].request.url != undefined) { 
                    if (items[i].request.header != undefined) { 
                        for (var j in items[i].request.header) {
                            items[i].request.header[j].last = items[i].request.header.length - 1 == j;
                        }
                    }
                }
            }
        }
        
        hash.item = items;
        //console.log("last: " + JSON.stringify(hash));
        return hash;
    }
    
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

