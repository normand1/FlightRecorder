![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/FlightRecLogo.png)


FlightRecorder (fltrec) is a solution for quickly saving and updating mock data json responses from your APIs.
FlightRecorder is built around the [Postman Newman CLI Tool](https://github.com/postmanlabs/newman).
Simply reference your postman collection and environment files while running FlightRecorder and your json responses will be savied to the output directory you've specified.

## Installation 

`npm install fltrec -g`

## How To
  Usage: collection [options] [collection...]

  Options:

    -o, --output <output>            The output path
    -e, --environment <environment>  the relative path to the environment file
    -v, --verbose                    verbose logging
    -m, --mustache <mustache>        the relative path to the mustache template file
    -x, --extension <extension>      extension for mustache template output (e.g. swift, kt, etc...)
    -h, --help                       output usage information
