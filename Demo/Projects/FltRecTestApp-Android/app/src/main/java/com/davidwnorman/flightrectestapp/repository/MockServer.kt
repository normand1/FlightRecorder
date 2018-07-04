import android.content.Context
import com.davidwnorman.flightrectestapp.R
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import java.io.InputStream

class MockServer(context: Context) {

    val server = MockWebServer()

    init {

        val awwwStream = context.resources.openRawResource(R.raw.awww).bufferedReader().use { it.readText() }
        val films_2Stream = context.resources.openRawResource(R.raw.films_2).bufferedReader().use { it.readText() }
//        val films_2AsString = films_2Stream.bufferedReader().use { it.readText() }
        val itunessearchStream = context.resources.openRawResource(R.raw.itunessearch).bufferedReader().use { it.readText() }
        //val itunessearchAsString = itunessearchStream.bufferedReader().use { it.readText() }
        val jsonplaceholderpostsStream = context.resources.openRawResource(R.raw.jsonplaceholderposts).bufferedReader().use { it.readText() }
        //val jsonplaceholderpostsAsString = jsonplaceholderpostsStream.bufferedReader().use { it.readText() }

        // setup the dispatcher to use files in the archive as the mock responses
        server.setDispatcher(object : Dispatcher() {
            override fun dispatch(request: RecordedRequest): MockResponse {
            if (request.getPath().equals("/Awww.json")){
                return MockResponse().setResponseCode(200).setBody(awwwStream)
            } else if (request.getPath().equals("/films/2")){
                return MockResponse().setResponseCode(200).setBody(films_2Stream)
            } else if (request.getPath().equals("/search")){
                return MockResponse().setResponseCode(200).setBody(itunessearchStream)
            } else if (request.getPath().equals("/posts/1")){
                return MockResponse().setResponseCode(200).setBody(jsonplaceholderpostsStream)
            }
                return MockResponse().setResponseCode(404);
            }   
            })
        }
}

