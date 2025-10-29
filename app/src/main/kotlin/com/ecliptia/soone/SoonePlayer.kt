package com.ecliptia.soone

import android.content.Context 
import android.media.MediaPlayer 
import android.util.Log 
import android.webkit.WebView 
import android.support.v4.media.session.MediaSessionCompat // Importe MediaSessionCompat
import kotlinx.serialization.Serializable 
import kotlinx.serialization.encodeToString 
import kotlinx.serialization.json.Json 

@Serializable data class CurrentTrack(
    val title: String, 
    val author: String,
    val picture: String, 
    val thumbnail: String,
    val duration: Int
)

@Serializable data class PlayerDefs (
    var duration: Int, 
    var volume: Int,
    var filter: String?,
    var currentDevice: String,
    var currentTrack: CurrentTrack? 
)

typealias EventModule = (source: SoonePlayer, eventData: Any?) -> Unit

class SoonePlayer (private val context: Context, var view: WebView) {
   
   private var isPlaying = false
   private var kamper: Any? = null
   private var isLooping = false
   private var itsAutoPlay = true
   private var linkedTrack = false
   private var mediaPlayer: MediaPlayer? = null 
   private var isDebugging = false
   private var mediaSession: MediaSessionCompat? = null 

   var currentTrack: CurrentTrack? = null 
   
   var playerStates: PlayerDefs = PlayerDefs(
     duration = 0, 
     volume = 1,
     filter = null,
     currentDevice = "speakers",
     currentTrack = null
   )
   
   var onPlay: EventModule = { _, _ -> }
   var onPause: EventModule = { _, _ -> } 
   var onEnded: EventModule = { _, _ -> } 
   var onLoadedAudio: EventModule = { _, _ -> } 
   var onNextTrack: EventModule = { _, _ -> }
   
   fun startDebugging(debugging: Boolean) {
     isDebugging = debugging
     Log.d("SooneDebug", "Started to Debug") 
   }
   
   fun play() {
      mediaPlayer?.start() 
      if (mediaPlayer?.isPlaying == true) {
          isPlaying = true
          onPlay(this, currentTrack) 
          if(isDebugging) Log.d("SooneDebug", "Música iniciada.")
      }
      mediaSession?.isActive = true
   }
   
   fun init(firstTrack: CurrentTrack) {
     if(linkedTrack) {
         if(isDebugging) Log.d("SooneDebug", "init() ignorado: linkedTrack=true")
         return
     }
     
     if(isDebugging) Log.d("SooneDebug", "Iniciando MediaPlayer e MediaSession...")
     
     mediaPlayer = MediaPlayer.create(context, R.raw.sza) 
     
     mediaSession = MediaSessionCompat(context, "SoonePlayerSession")
     mediaSession?.setMediaButtonReceiver(null)
     
     currentTrack = firstTrack
     linkedTrack = true
     
     onLoadedAudio(this, mediaPlayer) 
     
     mediaPlayer?.setOnCompletionListener { 
        onEnded(this, currentTrack)
        if(isDebugging) Log.d("SooneDebug", "Música terminada.")
     }
     
     val stringEncoded = Json.encodeToString(firstTrack)
     
     exectJs("""
       const song = $stringEncoded
     """)
     
     if (itsAutoPlay) {
         mediaPlayer?.start()
         mediaSession?.isActive = true
         if(isDebugging) Log.d("SooneDebug", "AutoPlay ativo. Música iniciada.")
     }
     
     if(isDebugging) Log.d("SooneDebug", "Inicialização do Player e Session concluída.")
   }

   fun release() {
    currentTrack = null
    mediaPlayer?.release()
    mediaSession?.isActive = false
    mediaSession?.release()
    if(isDebugging) Log.d("SooneDebug", "Player e MediaSession liberados.")
   }
   
   fun pause() { 
     mediaPlayer?.pause() 
     if (mediaPlayer?.isPlaying == false) {
          isPlaying = false
          onPause(this, currentTrack) 
          if(isDebugging) Log.d("SooneDebug", "Música pausada.")
      }
      mediaSession?.isActive = false
   } 
   
   fun exectJs(command: String, element: String? = null) {

     view.loadUrl("javascript:$command")
     
     if(isDebugging) Log.d("SooneDebug", "evaluating command $command")
   }
}

/** Soone Player **/
