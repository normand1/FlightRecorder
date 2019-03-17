import Foundation

public enum MockStubNames: String {
    case all
}

public extension MockNetworkRequestManager {
    func startMocks(startStubs: [MockStubNames]?) {

        guard let startStubs = startStubs else {
            return
        }
    }
}