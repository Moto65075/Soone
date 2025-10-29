package com.ecliptia.soone

import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebChromeClient
import android.webkit.ValueCallback
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat.checkSelfPermission
import android.Manifest
import android.util.Log
import android.widget.Toast // Para mostrar mensagens simples
import com.ecliptia.soone.SoonePlayer
import com.ecliptia.soone.SooneJSInterface

class MainActivity : AppCompatActivity() {

    // Declaração tardia para as Views e a classe SoonePlayer
    private lateinit var soonePlayer: SoonePlayer
    private lateinit var sooneJSInterface: SooneJSInterface
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
         setContentView(R.layout.activity_main)

        webView = findViewById(R.id.soone_webview)
        
        webView.settings.javaScriptEnabled = true 
        webView.settings.allowFileAccess = true
        webView.settings.allowUniversalAccessFromFileURLs = true

        val initialTrack = CurrentTrack(
            title = "Saturn",
            author = "SZA",
            picture = "android.resource://com.ecliptia.soone/${R.raw.sza_pic}",
            thumbnail = "android.resource://com.ecliptia.soone/${R.raw.sza_pic}",
            duration = 240
        )

        soonePlayer = SoonePlayer(this, webView)
        sooneJSInterface = SooneJSInterface(this, webView)

        appPermissions()
        
        webView.addJavascriptInterface(
            sooneJSInterface,
            "soone"   
        )

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                if (newProgress == 100) {
                    webView.evaluateJavascript("""
                    
    sooneInterface.init({ 
    title: "Saturn",
    author: "SZA",
    duration: 0,
    artwork: "android.resource://com.ecliptia.soone/${R.raw.sza_pic}",
    picture: "android.resource://com.ecliptia.soone/${R.raw.sza_pic}"
})
    
                    """, ValueCallback<String> { } )
                }
            }
        }

        
        
        setupEventListeners()

        soonePlayer.init(initialTrack)
        
       webView.loadUrl("file:///android_asset/index.html") 
       
        soonePlayer.startDebugging(true)
    }
    
    private fun setupEventListeners() {
        
        // --- EVENTO: onPlay ---
        soonePlayer.onPlay = { source, eventData ->
            Log.i("SooneEvents", "Evento onPlay capturado: Reprodução iniciada.")
            Toast.makeText(this, "Reproduzindo!", Toast.LENGTH_SHORT).show()
            
            if (eventData is CurrentTrack) {
                // Se a lógica do player garante que eventData é CurrentTrack
                Log.d("SooneEvents", "Tocando: ${eventData.title}")
            }
        }
        
        // --- EVENTO: onPause ---
        soonePlayer.onPause = { source, eventData ->
            Log.i("SooneEvents", "Evento onPause capturado: Reprodução pausada.")
            Toast.makeText(this, "Pausado.", Toast.LENGTH_SHORT).show()
        }
        
        // --- EVENTO: onEnded ---
        soonePlayer.onEnded = { source, eventData ->
            Log.i("SooneEvents", "Evento onEnded capturado: Faixa concluída.")
            // Lógica para carregar o onNextTrack ou parar o player aqui.
        }
        
        // --- EVENTO: onLoadedAudio ---
        soonePlayer.onLoadedAudio = { source, eventData ->
         soonePlayer.play()
            Log.i("SooneEvents", "Áudio carregado e player pronto para comandos JS.")
        } 
        
    }

    override fun onDestroy() {
        soonePlayer.release() 
        super.onDestroy()
    }
    
    fun appPermissions() {
    val permissions = arrayOf(
        android.Manifest.permission.BLUETOOTH,
        android.Manifest.permission.BLUETOOTH_ADMIN,
        android.Manifest.permission.BLUETOOTH_SCAN,
        android.Manifest.permission.BLUETOOTH_CONNECT,
        android.Manifest.permission.ACCESS_FINE_LOCATION,
        android.Manifest.permission.ACCESS_COARSE_LOCATION
    )

    val permissionsToRequest = permissions.filter {
        checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED
    }

    if (permissionsToRequest.isNotEmpty()) {
        ActivityCompat.requestPermissions(this, permissionsToRequest.toTypedArray(), 1)
    }
}

override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<out String>,
    grantResults: IntArray
) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    if (requestCode == 1) {
        for (i in permissions.indices) {
            if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                Log.d("MainActivity", "Permissão concedida: ${permissions[i]}")
            } else {
                Log.d("MainActivity", "Permissão negada: ${permissions[i]}")
            }
        }
    }
}
}