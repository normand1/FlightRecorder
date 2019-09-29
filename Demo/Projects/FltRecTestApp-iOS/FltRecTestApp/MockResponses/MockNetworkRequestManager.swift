import Foundation
import OHHTTPStubs

public class MockNetworkRequestManager {

    public static var sharedManager = MockNetworkRequestManager()
    var responseStubs = [OHHTTPStubsDescriptor]()

    init() {
        OHHTTPStubs.onStubActivation { (request: URLRequest, stub: OHHTTPStubsDescriptor, response: OHHTTPStubsResponse) in 
            print("Request: \(String(describing: request.url)) has been stubbed with \(String(describing: stub.name))")
        }
    }

func stubFactory(containsString: String, relativePathForMockJSONFile: String, stubName: String, httpMethod: String = "GET", featureKey: String? = nil, headerResponse: [String: Any]? = nil) -> OHHTTPStubsDescriptor {
    return stub(condition: { URLRequest in 
        return URLRequest.url?.absoluteString.contains(containsString) ?? false && URLRequest.httpMethod == httpMethod
    }, response: { URLRequest in 
        guard let stubPath = OHPathForFile(relativePathForMockJSONFile, type(of: self)) else {
            assert(false)
            return OHHTTPStubsResponse()
        }
        let headers: Dictionary = headerResponse ?? ["Accept": "application/json"]
        let stubResponse = OHHTTPStubsResponse(fileAtPath: stubPath, statusCode: 200, headers: headers)
        return stubResponse
    })
}

public func startAllMockEndpoints() {
    // add calls to generated mock endpoints here
}

public func stopAllMockEndpoints() {
    OHHTTPStubs.removeAllStubs()
}

func getHTTPBodyFromURLRequest(_ urlRequest: URLRequest) -> [String: AnyObject]? {
    var jsonDict: [String: AnyObject]?

    if let body = (urlRequest as NSURLRequest).ohhttpStubs_HTTPBody() {
        do {
            jsonDict = try JSONSerialization.jsonObject(with: body, options: []) as? [String: AnyObject]
        } catch {
            assert(false, error.localizedDescription)
        }
        return jsonDict
    }
    return nil
    }
}
