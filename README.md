![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/FlightRecLogo.png)


FlightRecorder (fltrec) is a solution for quickly saving and updating mock data json responses from your APIs.
FlightRecorder is built around the [Postman Newman CLI Tool](https://github.com/postmanlabs/newman).
Simply reference your postman collection and environment files while running FlightRecorder and your json responses will be saved to the output directory you've specified. Optionally, you can also use FlightRecorder to generate a mock server implementation for iOS (Swift) and Android (Kotlin) based on your postman collection and environment files.

## Installation 

`npm install fltrec -g`

## Demo

![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/flt_rec_demo.gif)

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

## iOS Example

1) Clone this repo and navigate to the `Demo/Projects/FltRecTestApp-iOS/` directory
2) Open the `FltRecTestApp.xcworkspace` workspace
3) In the MockResponses Xcode directory you will see a number of JSON files and the `MockNetworkRequestManager.swift` file

![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/ReadMeAssets/iosexample1.png)

4) These files have been generated by FlightRecorder and can be easily regenerated using this command:

```
fltrec collection Test-API.postman_collection.json -e test-env.postman_environment.json -m swift -o Projects/FltRecTestApp-iOS/FltRecTestApp/MockResponses
```
This command will use the Postman Collection and Environment file in the current directory to make the network requests specified in the collection (using the environment variables of the referenced Environment file) and save the JSON body responses to the specified output directory (Projects/FltRecTestApp-iOS/FltRecTestApp/MockResponses).
The `-m swift` flag also notifies flight recorder to generate an OHTTPMock implementation file that will override the same network requests if they are made by the iOS app and replace the response of those endpoints with that specified by 
`MockNetworkRequestManager.swift` file.
5) The MockNetworkRequestManager is directed to start intercepting and replacing network request responses with the command in `AppDelegate.swift`
```
MockNetworkRequestManager.sharedManager.startAllMockEndpoints()
```









