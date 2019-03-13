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
                // console.log("test: " + value);
                resultHash[value.key] = value.value;
            });
            }
        //console.log("resultHash: " + JSON.stringify(resultHash));
        return resultHash;
    }

    static buildMockStubs(options, collection) {
        var templateContents = fs.readFileSync(options.mustache);
        var managerTemplateContents = fs.readFileSync(options.managerTemplate);
        var envContents = fs.readFileSync(options.environment);
        // console.log('important:' + collection);
        var collectionContents = fs.readFileSync(collection);
        var mustacheHash = this.buildMustacheHashFromEnvFile(JSON.parse(envContents.toString()));
        collectionContents = this.fixPostmanCollectionTokensForHash(collectionContents, mustacheHash);
        var env_collection_combined = mustache.render(collectionContents.toString(), this.buildMustacheHashFromEnvFile(JSON.parse(envContents.toString())));
        
        env_collection_combined =  this.addPathToHash(JSON.parse(env_collection_combined));
        env_collection_combined =  this.addLastPathToHash(env_collection_combined);
        env_collection_combined =  this.addLastHeaderToHash(env_collection_combined);
        // console.log("final:" + templateContents.toString());
        env_collection_combined.item[0].item = this.fixVariableNamesForSwift(env_collection_combined.item[0].item);
        env_collection_combined.item[0].item = this.markLastHeader(env_collection_combined.item[0].item);
        env_collection_combined.item[0] = this.addHeaderResponsesToRequests(env_collection_combined.item[0].item. options.headers);
        var combinedTemplateAndCollection = mustache.render(templateContents.toString(), env_collection_combined.item[0]);
        var collectionName = this.getCollectionName(env_collection_combined);
        fs.writeFile((options.requestManager + "/MockNetworkRequestManager+" + collectionName + "." + options.extension), combinedTemplateAndCollection, function (error) {
            if (error) { console.error("error writing output" + error); }
            console.log(chalk.green(`📼Saved MockNetworkRequestManager.${options.extension} to ${options.output} 📼`));
        });
        fs.writeFile((options.requestManager + "/MockNetworkRequestManager." + options.extension), managerTemplateContents.toString(), function (error) {
            if (error) { console.error("error writing output" + error); }
            console.log(chalk.green(`📼Saved MockNetworkRequestManager.${options.extension} to ${options.output} 📼`));
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
                var headers = hash[item].request.header;
                if (headers) {
                    for (var i in headers) {
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
            Objects.keys(hash).forEach(function(key) {
                try {
                    var possObj = JSON.parse(hash[key]);
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

