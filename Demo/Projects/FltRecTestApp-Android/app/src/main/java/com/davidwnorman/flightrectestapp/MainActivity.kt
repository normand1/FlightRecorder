package com.davidwnorman.flightrectestapp

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.util.Log
import com.davidwnorman.flightrectestapp.repository.FakeRepo
import com.davidwnorman.flightrectestapp.service.FakeService

class MainActivity : AppCompatActivity() {

    private val TAG = javaClass.simpleName

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val fakeService = FakeService.instance

        val fakeRepo = FakeRepo(fakeService, this)

        fakeRepo.getPosts {
            Log.i(TAG, "Results = $it")
        }
    }
}
