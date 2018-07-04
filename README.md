![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/FlightRecLogo.png)


FlightRecorder (fltrec) is a solution for quickly saving and updating mock data json responses from your APIs.
FlightRecorder is built around the [Postman Newman CLI Tool](https://github.com/postmanlabs/newman).
Simply reference your postman collection and environment files while running FlightRecorder and your json responses will be saved to the output directory you've specified. Optionally, you can also use FlightRecorder to generate a mock server implementation for iOS (Swift) and Android (Kotlin) based on your postman collection and environment files.

## Installation 

`npm install fltrec -g`

## How To
  Usage: collection [options] [collection...]

  Options:

    -o, --output <output>            The output path
    -e, --environment <environment>  the relative path to the environment file
    -v, --verbose                    verbose logging
    -m, --mustache <mustache>        default mustache template [swift, kotlin] or the relative path to the mustache template file
    -x, --extension <extension>      extension for mustache template output (e.g. swift, kt, etc...)
    -h, --help                       output usage information

## Examples

Two sample projects are provided as example implementations of mock servers for both iOS and Android. The two implementations are different, but both implementations are made easily maintainable with the use of FlightRecorder.

## Demo

![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/flt_rec_demo.gif)
