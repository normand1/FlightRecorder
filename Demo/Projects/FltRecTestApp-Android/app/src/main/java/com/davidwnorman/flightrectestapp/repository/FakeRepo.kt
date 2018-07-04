package com.davidwnorman.flightrectestapp.repository

import android.content.Context
import com.davidwnorman.flightrectestapp.service.FakeResponse
import com.davidwnorman.flightrectestapp.service.FakeService
import org.jetbrains.anko.doAsync
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import MockNetworkRequestManager


class FakeRepo(private val fakeService: FakeService, context: Context) {

    var mockServer = MockNetworkRequestManager(context)

    fun getPosts(callBack: (Int?) -> Unit) {

        doAsync {

            var url = "https://jsonplaceholder.typicode.com/posts/1"
//            if (BuildConfig.USEMOCK) {
                url = mockServer.server.url("posts/1").toString()
//            }

            println(url)
            val podcastCall = fakeService.getPosts(url)
            podcastCall.enqueue(object : Callback<FakeResponse> {
                override fun onFailure(call: Call<FakeResponse>?, t: Throwable?) {
                    callBack(null)
                }

                override fun onResponse(call: Call<FakeResponse>?, response: Response<FakeResponse>?) {
                    val body = response?.body()
                    callBack(body?.userId)
                }
            })
        }
    }
}