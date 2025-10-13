/*
Equalizer kamper NO public
View Kamper
*/
class KamperEvent {
  constructor(){
      this.callbacks = {}
    }
    on(event, cb){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }
    emit(event, data){
        let cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(data))
        }
    }
}
class Kamper extends KamperEvent {
  constructor() {
    super();
    this.audioContext;
    this.mediaSource;
    this.filter;
    this.audioElement;
    this.bassBoostFilter;
    this.trebleFilter;
    this.karaokeFilter;
    this.inputAudioOrientation;
    this.vibratoFilter;
    this.tremoloFilter;
    this.frequencies = [];
    this.verifyAllIsConnected = () => {
      return !!(this.filter.connected && this.mediaSource.connected)
    }
  }
  register(context, media, filter, audio) {
    if(this.mediaSource && this.filter) return;
    this.audio = audio || this.audio || new Audio();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.mediaSource = this.audioContext.createMediaElementSource(this.audio);
    this.filter = this.audioContext.createBiquadFilter();
    this.connectNode()
  }
  connectNode() {
    if(this.verifyAllIsConnected()) return;
    this.filter.type = "allpass";
    this.filter.frequency.value = 1000;
    this.filter.Q.value = 5;
    this.filter.gain.value = 12;
    this.filter.connected = true;
    this.mediaSource.connected = true;
    this.filter.connect(this.audioContext.destination);
    this.mediaSource.connect(this.filter)
  }
  disconnectNode(optionName, contentOption) {
   if(!this.verifyAllIsConnected()) return;
   switch(optionName) {
      case "disconnectAndReconnect": {
        
    }
      break;
      case "destroySession": {
        
    }
      break;
   }
   this.mediaSource.disconnect();
   this.filter.disconnect();
   this.mediaSource.connect(this.audioContext.destination)
   this.emit("nodeOut", { message: "nodes is disconnected" })
  }
  setFilter(typeOfFilter) {
    if(!this.verifyAllIsConnected()) return;
    this.filter.type = typeOfFilter || "allpass"
  }
  setEqualizer(options) {
   if(!this.verifyAllIsConnected()) return;
   this.filter.frequency.value = options.frequency || this.filter.frequency.value;
   this.filter.Q.value = options.q || this.filter.Q.value;
   this.filter.gain.value = options.gain || this.filter.gain.value;
  }
  setBass(frequency) {
    if(!this.verifyAllIsConnected()) return;
    this.bassBoostFilter = (this.bassBoostFilter || this.audioContext.createBiquadFilter());
    this.bassBoostFilter.frequency.value = frequency || 5;
    this.bassBoostFilter.gain.value = 0;
    this.bassBoostFilter.type = "lowshelf";
    if(this.bassBoostFilter.connected) return;
    this.mediaSource.connect(this.bassBoostFilter);
    this.bassBoostFilter.connect(this.audioContext.destination);
    this.bassBoostFilter.connected = true;
  }
  setKaraoke(obj) {
    if(!this.verifyAllIsConnected()) return;
    this.karaoke = this.audioContext.createBiquadFilter();
    if(!this.karaoke.connected && this.karaoke) this.disconnect();
    this.karaoke.frequency.value = 2000
    this.karaoke.type = "lowpass";
    this.media.connect(this.karaoke)
    this.karaoke.connect(this.ctx.destination);
    this.karaoke.connected = true;
  }
  setVibrato() {
    this.vibratoFilter = this.vibratoFilter || [this.audioContext.createDelay(), this.audioContext.createGain(), this.audioContext.createOscillator()];
    console.log(this.vibratoFilter)
    this.vibratoFilter[0].delayTime.value = 5
    this.vibratoFilter[1].gain.value = 5
    this.vibratoFilter[2].type = 'sine';
    this.vibratoFilter[2].value = 5
    this.vibratoFilter[2].connect(this.vibratoFilter[0]);
    this.vibratoFilter[1].connect(this.vibratoFilter[0].delayTime);
    this.mediaSource.connect(this.vibratoFilter[0]);
    this.vibratoFilter[0].connect(this.vibratoFilter[1]);
    this.vibratoFilter[2].start(0);
    this.vibratoFilter.connected = true
}
  setTreble() {
    if(!this.verifyAllIsConnected()) return;
    this.trebleFilter = this.trebleFilter || this.audioContext.createBiquadFilter();
    this.trebleFilter.type='highpass'
    this.trebleFilter.frequency.value = 4000
    this.trebleFilter.gain.value = 6
    if(!this.trebleFilter.connected) {
      this.trebleFilter.connect(this.audioContext.destination)
      this.mediaSource.connect(this.trebleFilter)
    }
  }
  setFrequency(frequency, gain) {
   if(!this.verifyAllIsConnected()) return;
   const hasFrequencyOrExists = !!(!this.frequencies?.find(x=>x.name===frequency) && frequency)
   if(hasFrequencyOrExists) this.frequencies.push({
     filter: this.audioContext.createBiquadFilter({
     frequency: frequency,
     gain: gain,
     connected: false
   }),
     name: frequency
   });
  const frequencyFilter = this.frequencies?.find(x=>x.name===frequency).filter;
  if(gain < 1) {
    frequencyFilter.disconnect();
    this.mediaSource.disconnect(frequencyFilter)
    frequencyFilter.connected = false;
    console.log(frequency + " disconnected")
  }
  frequencyFilter.gain.value = gain;
  if(!frequencyFilter.connected && gain > 1) { frequencyFilter.connect(this.audioContext.destination);
    this.mediaSource.connect(frequencyFilter)
    frequencyFilter.connected = true
    console.log(frequency + " connected")
 }
  }
  convertToMono() {
    var splitter = this.ctx.createChannelSplitter(2);
    var merger = this.ctx.createChannelMerger(2);

    this.media.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
}
  watch(audioSettings) {
    const { filter, equalize } = audioSettings
    const { frequency, q, gain, bass, treble, vibrato, karaoke } = equalize;
    if(filter && filter !== this.filter.type) this.filter.type = filter
    if(bass) this.setBass(bass);
    if(treble) this.setTreble(treble);
    if(vibrato) this.setVibrato(vibrato);
    if(karaoke) this.setKaraoke(karaoke);
    if(equalize && (frequency !== this.filter.frequency.value || q !== this.filter.Q.value || gain !== this.filter.gain.value)) this.setEqualizer({
       frequency,
       q,
       gain
    })
   }
}