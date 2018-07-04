import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import java.io.File
import java.io.InputStream

class MockServer {

    private val server = MockWebServer()

    init {

        val awwwString: InputStream = File("awww.json").inputStream().bufferedReader().use { it.readText() }
        val films_2String: InputStream = File("films_2.json").inputStream().bufferedReader().use { it.readText() }

        // setup the dispatcher to use files as the mock responses
        server.setDispatcher(object : Dispatcher() {
            override fun dispatch(request: RecordedRequest): MockResponse {
            if (request.getPath().equals("/Awww.json")){
                return MockResponse().setResponseCode(200).setBody(awwwString)
            } else if (request.getPath().equals("/films/2")){
                return MockResponse().setResponseCode(200).setBody(films_2String)
            }
                return MockResponse().setResponseCode(404);
            }   
            })
        }
}

