![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/FlightRecLogo.png)


FlightRecorder (fltrec) is a solution for quickly saving and updating mock data json responses from your APIs.
FlightRecorder is built around the [Postman Newman CLI Tool](https://github.com/postmanlabs/newman).
Simply reference your postman collection and environment files while running FlightRecorder and your json responses will be savied to the output directory you've specified.

## Installation 

`npm install fltrec -g`

## How To
  Usage: fltrec [options] [command]

  Options:

    -o, --output <output>            The output path
    -e, --environment <environment>  the path to the environment file
    -v, --verbose                    verbose logging
    -h, --help                       output usage information

  Commands:

    collection [collection...]

# KNOWN ISSUES:
1) Currently all paths must be passed as absolute paths rather than relative paths.
