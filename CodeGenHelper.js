var fs = require('fs'); 
const mustache = require('mustache');
const path = require('path');
const chalk = require('chalk');


module.exports = class CodeGenHelper {

    static buildFileNameFromName(outputPath, requestName) {
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
        // console.log("template " + template);
        // console.log("view " + view);
        var templateContents = fs.readFileSync(options.mustache);
        var envContents = fs.readFileSync(options.environment);
        var collectionContents = fs.readFileSync(collection);
        var env_collection_combined = mustache.render(collectionContents.toString(), this.buildMustacheHashFromEnvFile(JSON.parse(envContents.toString())));
        
        env_collection_combined =  this.addPathToHash(JSON.parse(env_collection_combined));
        env_collection_combined =  this.addLastPathToHash(env_collection_combined);
        env_collection_combined =  this.addLastHeaderToHash(env_collection_combined);
        // console.log("final:" + templateContents.toString());
        var combinedTemplateAndCollection = mustache.render(templateContents.toString(), env_collection_combined);
        //console.log("combine env + collection:" + JSON.stringify(env_collection_combined));
        // console.log("output:" + combinedTemplateAndCollection);
        fs.writeFile((options.output + "/MockNetworkRequestManager." + options.extension), combinedTemplateAndCollection, function (error) {
            if (error) { console.error("error writing output" + error); }
            console.log(chalk.green(`📼   Saved MockNetworkRequestManager.${options.extension} to ${options.output} 📼`));
        });
    }

    static addPathToHash(hash) {

        var items = hash.item;
        //console.log("addToPath: " + items);
        for (var i in items) {
            if (items[i].request.url.path != undefined) { 
                // console.log("path strings: "+ items[i].request.url.path.join('/'));
                items[i].request.url.joinedPath = "/" + path.join(items[i].request.url.path.join('/'));   
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
            if (items[i].request.url.path != undefined) { 
                // console.log("path strings: "+ items[i].request.url.path.join('/'))
            }
            items[i].last = items.length - 1 == i;
        }
        
        hash.item = items;
        //console.log("last: " + JSON.stringify(hash));
        return hash;
    }

    static addLastHeaderToHash(hash) {
    
        var items = hash.item;
        for (var i in items) {
            if (items[i].request.header != undefined) { 
                for (var j in items[i].request.header) {
                    items[i].request.header[j].last = items[i].request.header.length - 1 == j;
                }
            }
        }
        
        hash.item = items;
        //console.log("last: " + JSON.stringify(hash));
        return hash;
    }
    
}

