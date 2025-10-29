package com.ecliptia.soone

import android.webkit.WebView
import android.content.Context
import android.os.Build
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.pm.PackageManager
import android.util.Log
import android.media.AudioDeviceInfo
import android.media.AudioManager
import kotlin.collections.mutableMapOf


class DeviceManager (private val context: Context, var view: WebView) {
   
   private var bluetoothAdapter: BluetoothAdapter? = null
   private var devicesList = mutableMapOf<String, BluetoothDevice>()


   fun init() {
    val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as android.bluetooth.BluetoothManager
    bluetoothAdapter = bluetoothManager.adapter
    bluetoothAdapter?.let { adapter -> 
          
           if(adapter.isEnabled) {
           val pairedDevices: Set<BluetoothDevice>? = adapter.bondedDevices
           
           pairedDevices?.forEach { device ->
               val deviceName = device.name
               val deviceHardwareAddress = device.address // MAC address
               devicesList[deviceHardwareAddress] = device
               Log.d("SooneDeviceManager", "Device found: $deviceName - $deviceHardwareAddress")
           }
         } else {
            Log.d("SooneDeviceManager", "bluetooth is off")

         }
        } ?: run {
           Log.e("SooneDeviceManager", "Bluetooth not supported on this device")
        }
       }

   fun getDevicesList(): Map<String, String> {
       val result = mutableMapOf<String, String>()
       devicesList.forEach { (address, device) ->
           result[address] = device.name
       }

       getAudioOutputs().forEach { deviceName ->
           val displayName = if(getPhoneModel() == deviceName) "My Phone" else "$deviceName - fisic output"
           result[deviceName] = displayName
       }

       return result
    }

   fun getAudioOutputs(): List<String> {
       val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
       val devices = audioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS)
       val deviceNames = devices.map { deviceInfo: AudioDeviceInfo ->
           deviceInfo.productName.toString()
       }
       return deviceNames
   }

   fun connectToDevice(address: String) {
       val device = devicesList[address]
       if (device != null) {
        
           Log.d("SooneDeviceManager", "Connecting to device: ${device.name} - $address")
           
       } else {
           Log.e("SooneDeviceManager", "Device with address $address not found")
       }
   }

   private fun getPhoneModel(): String {
    val manufacturer = Build.MANUFACTURER
    val model = Build.MODEL

    return if (model.lowercase().startsWith(manufacturer.lowercase())) {
        capitalize(model)
    } else {
        "${capitalize(manufacturer)} ${model}"
    }
}

   private fun capitalize(s: String?): String {
    if (s == null || s.isEmpty()) {
        return ""
    }
    val first = s[0]
    return if (Character.isUpperCase(first)) {
        s
    } else {
        Character.toUpperCase(first) + s.substring(1)
    }
}
}