package com.ecliptia.soone

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebView
import android.webkit.ValueCallback
import android.util.Log
import android.widget.Toast // Para mostrar mensagens simples

class MainActivity : AppCompatActivity() {

    // Declaração tardia para as Views e a classe SoonePlayer
    private lateinit var soonePlayer: SoonePlayer
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
         setContentView(R.layout.activity_main)

        webView = findViewById(R.id.soone_webview)
        
        webView.settings.javaScriptEnabled = true 
        webView.settings.allowFileAccess = true
        webView.settings.allowUniversalAccessFromFileURLs = true

        val initialTrack = CurrentTrack(
            title = "O Tema do Soone",
            author = "Ecliptia Studios",
            picture = "url_cover.jpg",
            thumbnail = "url_thumb.jpg",
            duration = 240
        )

        soonePlayer = SoonePlayer(this, webView)
        
        webView.addJavascriptInterface(
            soonePlayer,
            "soone"   
        )
        
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
        webView.evaluateJavascript("""
            window.onload=()=>{
           const playerI = new PlayerInterface()
           playerI.openMiniPlayer()
            }
            """, ValueCallback<String>() {})
            Log.i("SooneEvents", "Áudio carregado e player pronto para comandos JS.")
        } 
        
   }

    override fun onDestroy() {
        soonePlayer.release() 
        super.onDestroy()
    }
}

