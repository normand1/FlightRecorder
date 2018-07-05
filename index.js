#!/usr/bin/env node

var newman = require('newman');
var program = require('commander');
const codegenHelper = require('./CodeGenHelper');
const chalk = require('chalk');
const mustache = require('mustache');
var fs = require('fs'); 

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
    
        collection = process.cwd() + '/' + collection;
        options.output = options.output ? process.cwd() + '/' + options.output : process.cwd();
        options.environment = options.environment ? process.cwd() + '/' + options.environment : "";
        options.extension = mapLanguageToFileExtension(options.mustache) ? mapLanguageToFileExtension(options.mustache) : options.extension;
        options.mustache = options.mustache ? mapLanguageToMustachePath(options.mustache) : null ;
        options.requestManager = options.requestManager ? process.cwd() + '/' + options.requestManager : process.cwd();

        console.log('🚀   Flight Recorder Started!  🚀');
        //console.log(options);
        if (!Array.isArray(collection)) {
            collection = [collection];
        }

        collection.forEach(function (collect) {

            if (options.mustache) {
                codegenHelper.buildMockStubs(options, collect);
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
                        const outputFileName = codegenHelper.buildFileNameFromName(options.output, execution.item.name);
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