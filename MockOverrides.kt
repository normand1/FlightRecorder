
import Foundation
import OHHTTPStubs

public class MockNetworkRequestManager {

    public  static var sharedManager = MockNetworkRequestManager()

    var awwwStub: OHHTTPStubsDescriptor!
    var films_2Stub: OHHTTPStubsDescriptor!

    // MARK: Helper Functions

    init() {
        OHHTTPStubs.onStubActivation { (request: URLRequest, stub: OHHTTPStubsDescriptor, response: OHHTTPStubsResponse) in
            print("[OHHTTPStubs] Request to \(String(describing: request.url)) has been stubbed with \(String(describing: stub.name))")
        }
    }

    public func stopAllMockEndpoints() {
        OHHTTPStubs.removeAllStubs()
    }

    func getHTTPBodyFromURLRequest(_ urlRequest: URLRequest) -> [String: AnyObject]? {
        var jsonDict: [String: AnyObject]?

        if let body = (urlRequest as NSURLRequest).ohhttpStubs_HTTPBody() {
            do {
                jsonDict = try JSONSerialization.jsonObject(with: body, options: []) as? [String: AnyObject]
            } catch let error {
                assert(false, error.localizedDescription)
            }

            return jsonDict
        }

        return nil
    }
}

public extension MockNetworkRequestManager {

    func startAllMockEndpoints() {

        // MARK: - awww
        awwwStub = stub(condition: { urlRequest in
            return (urlRequest.url?.absoluteString.containsString("Awww.json")) ?? false
        }, response: { urlRequest in
            guard let stubPath = OHPathForFile("awww.json", type(of: self)) else {
                return OHHTTPStubsResponse()
            }
            let headers: Dictionary = ["Accept-Language": "en-US","Domain": "TEST","Country-Code": "US","Channel-Type": "Web","Customer-IP-Address": "127.0.0.1","Content-Type": "application/json",]

            let stubResponse = OHHTTPStubsResponse(fileAtPath: stubPath, statusCode: 200, headers: headers)

            return stubResponse
        })

        // MARK: - films_2
        films_2Stub = stub(condition: { urlRequest in
            return (urlRequest.url?.absoluteString.containsString("films,2")) ?? false
        }, response: { urlRequest in
            guard let stubPath = OHPathForFile("films_2.json", type(of: self)) else {
                return OHHTTPStubsResponse()
            }
            let headers: Dictionary = []

            let stubResponse = OHHTTPStubsResponse(fileAtPath: stubPath, statusCode: 200, headers: headers)

            return stubResponse
        })

    }
}
