#!/usr/bin/env node

var newman = require('newman');
var program = require('commander');
const codegenHelper = require('./CodeGenHelper');
const chalk = require('chalk');
const mustache = require('mustache');
var fs = require('fs'); 
var path = require('path');
var mkdirp = require('mkdirp');


var pathMap = {};


mustache.escape = function(text) {return text};

program
.version(require('./package.json').version)
.command('collection')
.option('-e, --environment <environment>', 'the relative path to the environment file')
.option('-o, --output <output>', 'The path to the output directory where you would like to save the network request body responses')
.option('-v, --verbose', 'verbose logging')
.option('-m, --mustache <mustache>', 'default mustache template [swift, kotlin] or the relative path to the mustache template file')
.option('-r, --requestManager <requestManager>', 'the path to the output directory for the MockNetworkRequestManager')
.option('-x, --extension <extension>', 'extension for mustache template output (e.g. swift, kt, etc...)')
.action(function (collection, options) {

    if (collection) {
    
        collection = path.relative(process.cwd(), collection);
        options.output = options.output != undefined ? options.output : process.cwd();
        options.environment = path.relative(process.cwd(), options.environment);
        options.extension = mapLanguageToFileExtension(options.mustache) ? mapLanguageToFileExtension(options.mustache) : options.extension;
        options.managerTemplate = mapLanguageToManagerTemplate(options.mustache);
        options.mustache = options.mustache ? mapLanguageToMustachePath(options.mustache) : null;
        options.requestManager = options.requestManager ? process.cwd() + '/' + options.requestManager : process.cwd();
        options.headers = [];

        console.log('🚀 Flight Recorder Started!  🚀');
        if (!Array.isArray(collection)) {
            collection = [collection];
        }
        collection.forEach(function (collect) {
            buildPathMapFromCollection(collect);
            console.log(pathMap);
            newman.run({
                collection: collect,
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
                    summary.run.executions.forEach(function (execution, index, array) {

                        if (execution.response == null) {
                            console.error(chalk.red(`No Response from ${execution.item.name}`));
                            return
                        }
                        const outputFileName = codegenHelper.buildFileNameFromName(options.output, execution.item.name, pathMap);
                        var fileDirectory = outputFileName;
                        options.headers.push(execution.response.headers.members);
                        fileDirectory = fileDirectory.substring(0, fileDirectory.lastIndexOf("/"));
                        mkdirp(fileDirectory, function(err) { 
                            fs.writeFile(outputFileName, execution.response.stream, function (error) {
                                if (error) { console.error("error writing output" + error); }
                                console.log(chalk.green(`📼Saved response from ${execution.item.name} to ${outputFileName} 📼`));
                            });
                            if (index === array.length - 1) {
                                if (options.mustache) {
                                    codegenHelper.buildMockStubs(options, collect);
                                }
                            }
                        });
                        
                    });
                }
            });
        });
        } else {
            console.log(chalk.red("No collection path found"));
        } 
  });

  function buildPathMapFromCollection(postmanCollection) {
    var text = fs.readFileSync(postmanCollection,'utf8') 
    var collection = JSON.parse(text);
    var test = buildItemNamesMap(collection, ["/"])
  }

  function buildItemNamesMap(collection, aPath) {
    if (collection.item == null) {
        pathMap[collection.name] = path.join(aPath);
        return
    }
    if (collection.name != undefined) {
        aPath += collection.name + "/";
    }
    collection.item.forEach(function (item) {
        buildItemNamesMap(item, aPath);
    })
  }

  function mapLanguageToManagerTemplate(langOrPath) {
    switch(langOrPath) {
        case 'swift':
            return __dirname + '/Templates/MockNetworkRequestManager.swift'
        case 'kotlin':
            return null
        default:
            return process.cwd() + '/' + langOrPath
    }
  }

  function mapLanguageToMustachePath(langOrPath) {
    switch (langOrPath) {
        case 'swift':
            return __dirname + '/Templates/MockSwiftTemplate.mustache'
        case 'kotlin':
            return __dirname + '/Templates/MockKotlinTemplate.mustache'
        default:
            return process.cwd() + '/' + langOrPath
    }
  }

  function mapLanguageToFileExtension(langOrPath) {
      //console.log("langOrPath: " + langOrPath)
    switch (langOrPath) {
        case 'swift':
            return 'swift'
        case 'kotlin':
            return 'kt'
        default:
            return null
    }
  }
  
  program.parse(process.argv);
