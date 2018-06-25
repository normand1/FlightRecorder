#!/usr/bin/env node

var newman = require('newman');
var fs = require('fs'); 
var program = require('commander');
const chalk = require('chalk');

 program
 .command('collection [collection...]')
  .option('-o, --output <output>', 'The output path')
  .option('-e, --environment <environment>', 'the path to the environment file')
  .option('-v, --verbose', 'verbose logging')
  .action(function (collection, options) {
    if (collection) {

        console.log('🛫   Flight Recorder Started!  🛫');
        console.log(options);

        collection.forEach(function (collect) {
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

function buildFileNameFromPath(pathVars) {
    finalStr = "";
    for (var val of pathVars) {
        finalStr += val
        finalStr += "_"
    }
    return finalStr;
}