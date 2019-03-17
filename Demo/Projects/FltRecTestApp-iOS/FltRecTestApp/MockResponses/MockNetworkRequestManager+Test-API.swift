import Foundation

public enum MockStubNames: String {
    case films_2
    case jsonplaceholderposts
    case itunessearch
    case all
}

public extension MockNetworkRequestManager {
    func startMocks(startStubs: [MockStubNames]?) {

        guard let startStubs = startStubs else {
            return
        }
        // MARK: films_2
        if startStubs.contains(.films_2) || startStubs.contains(.all) {
            responseStubs.append(stubFactory(containsString: "/films/2", relativePathForMockJSONFile: "films_2.json", stubName: "films_2", httpMethod: "GET", headerResponse: ["Date": "Sun, 17 Mar 2019 03:45:52 GMT", "Content-Type": "application/json", "Transfer-Encoding": "chunked", "Connection": "keep-alive", "Allow": "GET, HEAD, OPTIONS", "X-Frame-Options": "SAMEORIGIN", "Etag": "W/'126e2153f72e9ac2d1f657cdc0456c26'", "Vary": "Accept, Cookie", "Via": "1.1 vegur", "Expect-CT": "max-age=604800, report-uri='https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct'", "Server": "cloudflare", "CF-RAY": "4b8bf9f99a57799d-SEA", "Content-Encoding": "gzip"]))
        }
        // MARK: jsonplaceholderposts
        if startStubs.contains(.jsonplaceholderposts) || startStubs.contains(.all) {
            responseStubs.append(stubFactory(containsString: "/posts/1", relativePathForMockJSONFile: "jsonplaceholderposts.json", stubName: "jsonplaceholderposts", httpMethod: "GET", headerResponse: ["Date": "Mon, 18 Mar 2019 03:45:52 GMT", "Content-Type": "application/json; charset=utf-8", "Transfer-Encoding": "chunked", "Connection": "keep-alive", "Set-Cookie": "__cfduid=d061aad0078744fac1aa56ae8d7729bfa1552794352; expires=Mon, 16-Mar-20 03:45:52 GMT; path=/; domain=.typicode.com; HttpOnly", "X-Powered-By": "Express", "Vary": "Origin, Accept-Encoding", "Access-Control-Allow-Credentials": "true", "Cache-Control": "public, max-age=14400", "Pragma": "no-cache", "Expires": "Sun, 17 Mar 2019 07:45:52 GMT", "X-Content-Type-Options": "nosniff", "Etag": "W/'124-yiKdLzqO5gfBrJFrcdJ8Yq0LGnU'", "Via": "1.1 vegur", "CF-Cache-Status": "HIT", "Expect-CT": "max-age=604800, report-uri='https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct'", "Server": "cloudflare", "CF-RAY": "4b8bf9fcd8a6bb66-SEA", "Content-Encoding": "gzip"]))
        }
        // MARK: itunessearch
        if startStubs.contains(.itunessearch) || startStubs.contains(.all) {
            responseStubs.append(stubFactory(containsString: "/search", relativePathForMockJSONFile: "itunessearch.json", stubName: "itunessearch", httpMethod: "GET", headerResponse: ["x-apple-jingle-correlation-key": "OARWMKCERHQEJJA2QCM6W7OQ64", "x-apple-application-site": "ST11", "content-disposition": "attachment; filename=1.txt", "apple-originating-system": "MZStoreServices", "Content-Encoding": "gzip", "strict-transport-security": "max-age=31536000", "x-apple-translated-wo-url": "/WebObjects/MZStoreServices.woa/ws/wsSearch?term=Android+Developer&media=podcast&urlDesc=", "apple-tk": "false", "x-apple-orig-url": "https://itunes.apple.com/search?term=Android+Developer&media=podcast", "apple-seq": "0", "apple-timing-app": "53 ms", "x-content-type-options": "nosniff", "Content-Type": "text/javascript; charset=utf-8", "x-apple-application-instance": "2000963", "x-webobjects-loadaverage": "0", "x-apple-request-uuid": "70236628-4489-e044-a41a-8099eb7dd0f7", "Content-Length": "1007", "Vary": "Accept-Encoding", "Cache-Control": "max-age=65750", "Date": "Sun, 17 Mar 2019 03:45:52 GMT", "X-Cache": "TCP_HIT from a23-194-213-21.deploy.akamaitechnologies.com (AkamaiGHost/9.6.0-24900238) (-)", "X-True-Cache-Key": "/L/itunes.apple.com/search vcd=2897 ci2=media=podcast&term=Android+Developer__", "Connection": "keep-alive", "X-Apple-Partner": "origin.0"]))
        }
    }
}
