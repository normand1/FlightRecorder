![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/ReadMeAssets/FlightRecLogo.png)


FlightRecorder (fltrec) is a solution for quickly saving and updating mock data json responses from your APIs.
FlightRecorder is built around the [Postman Newman CLI Tool](https://github.com/postmanlabs/newman).
Simply reference your postman collection and environment files while running FlightRecorder and your json responses will be saved to the output directory you've specified.

## Why Use FlightRecorder?

### It's an easy way to create and update mock data for tests
There are a number of network request mocking frameworks available for both iOS and Android. FlightRecorder has built in support for [OHHTTPStubs](https://github.com/AliSoftware/OHHTTPStubs) and [okhttp/mockwebserver](https://github.com/square/okhttp/tree/master/mockwebserver)
These frameworks allow you to test your app in a reliable way regardless of server state. These mocking frameworks are especially useful when testing UI elements that display responses from a backend service. Using mock responses you can gaurantee that the response will be the same every time so it's easy to write tests against. However, the drawback to these mock responses are that they can get stale.  As useful as these tests can be, it's possible that things on the backend can change without you realizing it and leave your tests out of date. FlightRecorder provides an easy way to update all of you mock responses in one go.

### Use Postman to automate mock response gathering

Getting all of the mock responses for a whole application can be tedious. However, if you create a postman collection (or already have one) to store all of the network requests your app makes you can regenerate your mock responses and server stubs with a single command!

## Installation 

`npm install fltrec -g`

## Dependencies


[Postman](https://www.getpostman.com/postman) is used to create the API documentation used by FlightRecorder to generate mock server stubs and save responses from the live API.

## Demo

![alt text](https://raw.githubusercontent.com/normand1/FlightRecorder/master/ReadMeAssets/flt_rec_demo.gif)

## How To
```
Usage: collection [options]

Options:

-e, --environment <environment>        the relative path to the environment file
-o, --output <output>                  The path to the output directory where you would like to save the network request body responses
-v, --verbose                          verbose logging
-h, --help                             output usage information
```

## Example

The Mock JSON Files are created through the use of a Postman Collection JSON file. You can easily see an example in action by changing directory to the `Demo_MockServerOnly` folder.

When you first clone this repo the only file in this directory will be the Star Wars API Postman Collection named: `SWAPI.postman_collection.json` 

![Postman Example](https://raw.githubusercontent.com/normand1/FlightRecorder/master/ReadMeAssets/postman_swapi.png)

This postman collection includes folders which contain requests to various Star Wars API endpoints. This folder structure will be re-created and the responses to these requests will be placed in folders in the selected directory mirroring the structure in Postman. 

Next, run this command in the terminal in the `Demo_MockServerOnly` directory:
`fltrec collection SWAPI.postman_collection.json`

Now you should have a new folder in the current directory named `api` (mirroring what you see in postman) and that folder should be full of saved json responses from the Star Wars API.

![folder structure](https://raw.githubusercontent.com/normand1/FlightRecorder/master/ReadMeAssets/api_folder_structure.png)
