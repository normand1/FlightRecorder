#!/usr/bin/env node

var newman = require('newman');
var fs = require('fs'); 
var program = require('commander');
const chalk = require('chalk');
const mustache = require('mustache');

mustache.escape = function(text) {return text};

program
.version(require('./package.json').version)
.command('collection [collection...]')
.option('-o, --output <output>', 'The output path')
.option('-e, --environment <environment>', 'the path to the environment file')
.option('-v, --verbose', 'verbose logging')
.option('-m, --mustache <mustache>', 'mustache template file path')
.option('-x, --extension <extension>', 'extension for mustache template output (e.g. swift, kt, etc...)')
.action(function (collection, options) {

    if (collection) {
        console.log("collection: " + __dirname + '/' + collection);
        collection = __dirname + '/' + collection;
        options.output = options.output ? __dirname + '/' + options.output : __dirname;
        options.environment = options.environment ? __dirname + '/' + options.environment : "";
        options.mustache = options.mustache ? __dirname + '/' + options.mustache : null ;

        console.log('🛫   Flight Recorder Started!  🛫');
        
        if (!Array.isArray(collection)) {
            collection = [collection];
        }

        collection.forEach(function (collect) {

            if (options.mustache) {
                buildMockStubs(options, collect);
            }

            newman.run({
                collection: require(collect),
                reporters: 'cli',
                silent: options.verbose ? false : true,
                environment: options.environment
            }, function (err) {
                if (err) { 
                    console.error(err);
                }
            }).on('done', function (err, summary) {
                if (err || summary.error) {
                    console.error('collection run encountered an error:' + err + summary.error);
                }
                else {
                    summary.run.executions.forEach(function (execution) {

                        if (execution.response == null) {
                            console.error(chalk.red(`No Response from ${execution.item.name}`));
                            return
                        }
                        const outputFileName = buildFileNameFromName(options.output, execution.item.name);
                        fs.writeFile(outputFileName, execution.response.stream, function (error) {
                                if (error) { console.error("error writing output" + error); }
                                console.log(chalk.green(`📼   Saved response from ${execution.item.name} to ${outputFileName} 📼`));
                        });
                    });
                }
            });
        });
        } else {
            console.log(chalk.red("No collection path found"));
        } 
  });
  
  program.parse(process.argv);

function buildFileNameFromName(outputPath, requestName) {
    return outputPath + `/${requestName}.json`
}

function buildMockStubs(options, collection) {
    // console.log("template " + template);
    // console.log("view " + view);
    var templateContents = fs.readFileSync(options.mustache);
    var envContents = fs.readFileSync(options.environment);
    var collectionContents = fs.readFileSync(collection);
    var env_collection_combined = mustache.render(collectionContents.toString(), buildMustacheHashFromEnvFile(JSON.parse(envContents.toString())));
    // console.log(viewContents.toString());
    var combinedTemplateAndCollection = mustache.render(templateContents.toString(), JSON.parse(env_collection_combined.toString())
);
    // console.log("combine env + collection:" + env_collection_combined.toString());
    // console.log("output:" + combinedTemplateAndCollection);
    fs.writeFile(("MockOverrides." + options.extension), combinedTemplateAndCollection, function (error) {
        if (error) { console.error("error writing output" + error); }
        console.log(chalk.green(`📼   Saved MockOverrides.${options.extension} to ${options.output} 📼`));
    });
}

function buildMustacheHashFromEnvFile(env) {

    var resultHash = {};
    
    if (env) {
        
        env.values.forEach(function(value){
            // console.log("test: " + value);
            resultHash[value.key] = value.value;
        });
        }
    // console.log("resultHash: " + JSON.stringify(resultHash));
    return resultHash;

}