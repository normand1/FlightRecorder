import android.content.Context
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest

class MockNetworkRequestManager(context: Context) {

    val server = MockWebServer()

    init {

        val awwwString: String = context.resources.openRawResource(R.raw.awww).bufferedReader().use { it.readText() }
        val films_2String: String = context.resources.openRawResource(R.raw.films_2).bufferedReader().use { it.readText() }
        val itunessearchString: String = context.resources.openRawResource(R.raw.itunessearch).bufferedReader().use { it.readText() }
        val jsonplaceholderpostsString: String = context.resources.openRawResource(R.raw.jsonplaceholderposts).bufferedReader().use { it.readText() }

        // setup the dispatcher to use files as the mock responses
        server.setDispatcher(object : Dispatcher() {
            override fun dispatch(request: RecordedRequest): MockResponse {
            if (request.path.equals("/Awww.json")){
                return MockResponse().setResponseCode(200).setBody(awwwString)
            } else if (request.path.equals("/films/2")){
                return MockResponse().setResponseCode(200).setBody(films_2String)
            } else if (request.path.equals("/search")){
                return MockResponse().setResponseCode(200).setBody(itunessearchString)
            } else if (request.path.equals("/posts/1")){
                return MockResponse().setResponseCode(200).setBody(jsonplaceholderpostsString)
            }
                return MockResponse().setResponseCode(404);
            }   
            })
        }
}