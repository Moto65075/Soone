package com.ecliptia.soone

import android.content.Context
import android.webkit.WebView
import android.webkit.JavascriptInterface

class SooneJSInterface(private val context: Context, private val view: WebView) {
    private val deviceManager = DeviceManager(context, view)
    @JavascriptInterface fun getDevicesList(): String {
        deviceManager.init()
        val devices =  deviceManager.getDevicesList()
        return devices.toString()
    }
}