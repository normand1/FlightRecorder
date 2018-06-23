
var newman = require('newman'); // require newman in your project
var fs = require('fs'); // require newman in your project

// ---- MODIFY SCRIPT HERE IF NECESSARY --------
var PATH_TO_COLLECTION_TO_RUN = '/Users/davidnorman/Downloads/StarwarsCollection.postman_collection.json';
var PATH_TO_WRITE_JSON_RESPONSE_TO = './json_body_responses/'
// ---- MODIFY SCRIPT HERE IF NECESSARY --------

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('/Users/davidnorman/Downloads/StarwarsCollection.postman_collection.json'),
    reporters: 'cli'
}, function (err) {
	if (err) { 
        console.log(err);
    }
    console.log('collection run complete!');
}).on('done', function (err, summary) {
    if (err || summary.error) {
        console.error('collection run encountered an error.');
    }
    else {
        
        summary.run.executions.forEach(function (execution) {
            console.log(buildFileNameFromPath(execution.item.request.url.path));
            console.log(execution.response.json()); //provides a JSON representation of the response body
            fs.writeFile(PATH_TO_WRITE_JSON_RESPONSE_TO + `${buildFileNameFromPath(execution.item.request.url.path)}.json`, execution.response.stream, function (error) {
                    console.log("ERROR");
                      if (error) { console.error("error writing output"); }
                   });
        });
    }
});

function buildFileNameFromPath(pathVars) {
    finalStr = "";
    for (var val of pathVars) {
        finalStr += val
        finalStr += "_"
    }
    return finalStr;
