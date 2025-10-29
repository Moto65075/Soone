class SoonePlayerInterface {
  constructor () {
    this.hasControlsIsHide = false;
    this.pictureColor = "#000"
    this.sooneKotlinWorking = false;
    this.devices = [];
    this.track = {};
    this.miniPlayerUi = null;
    this.bigPlayerUi = null
    this.playerLoaded = false;
    this.searchFilter = null
  }
  init(track, playerDefs) {
    if(this.sooneKotlinWorking) return;
    this.miniPlayerUi = document.querySelector(".miniPlayer");
    this.bigPlayerUi = document.querySelector(".player");
    
    console.log("[ SOONE ]: Started Ui interface's")
    this.track = {
      thumbnail: track.artwork,
      picture: track.picture,
      author: track.author,
      title: track.title,
      duration: track.duration
    }
    if(!"mediaSesion" in navigator || !window.soone) throw new TypeError("[ SOONE ]: can't init without JS bridging.");
    this.setPlayerScreenEvents();
    this.sooneKotlinWorking = false;
  }
  openPlayer() {
      this.miniPlayerUi.classList.add("playerActive");
      this.bigPlayerUi.classList.remove("closed");
      document.body.style.overflowY = "none"
    }
  closePlayer() {
      const miniPlayer = document.getElementsByClassName("miniPlayer")[0];
      const player = document.getElementsByClassName("player")[0]
      miniPlayer.classList.remove("playerActive")
      setTimeout(()=>player.classList.add("closed"),100)
      document.body.style.overflowY = "scroll"
      if(this.hasControlsIsHide) this.controlsScreen()
    }
  controlsScreen() {
      const controls = document.getElementsByClassName("controls")[0];
      const lyrics = document.getElementsByClassName("lyrics")[0]
      const panel = document.getElementsByClassName("panel")[0];
      if(!this.hasControlsIsHide) {
        controls.classList.add("hide")
        lyrics.classList.add("hide")
        panel.classList.add("suspended")
        this.hasControlsIsHide = true
      } else {
        controls.classList.remove("hide")
        lyrics.classList.remove("hide")
        panel.classList.remove("suspended")
        this.hasControlsIsHide = false
      }
    }
  callMiniPlayer() {
      const miniThumbnail = this.miniPlayerUi.querySelector(".mini-thumbnail");
      const miniTitle = this.miniPlayerUi.querySelector(".mini-title");
      const songAuthor = this.miniPlayerUi.querySelector(".song-author");
      
      if(!this.playerLoaded) {
      miniThumbnail.src = this.track.picture;
      miniTitle.innerHTML = this.track.title;
      songAuthor.innerHTML = this.track.author;
      miniThumbnail.onload = () => {
      this.pictureColor = this.getAverageColor(miniThumbnail)
      this.miniPlayerUi.style.background = this.getAverageColor(miniThumbnail).replace(")",", 0.7)").replace("rgb", "rgba");
     }
      this.setPlayerStyle()
      this.playerLoaded = true
    }
      this.miniPlayerUi.classList.remove("closed");
    }
  setPlayerStyle() {
    const [
      thumbnail,
      songTitle,
      songAuthor,
      songPicture,
      durationReal
      ] = [
      this.bigPlayerUi.querySelector(".thumbnail"),
      this.bigPlayerUi.querySelector(".song-title"),
      this.bigPlayerUi.querySelector(".song-author"),
      this.bigPlayerUi.querySelector(".song-picture"),
      document.getElementById("duration-real")
      ]
    
    thumbnail.src = this.track.thumbnail;
    songTitle.innerHTML = this.track.title;
    songAuthor.innerHTML = this.track.author;
    songPicture.src = this.track.picture
    durationReal.innerHTML = this.parseTime(this.track.duration)
  }
  setPlayerScreenEvents() {
    enableSwipeEvents(this.bigPlayerUi)
    enableSwipeEvents(this.miniPlayerUi)
    this.bigPlayerUi.addEventListener("swipe-down",(e)=>{
       this.closePlayer()
      })
   this.miniPlayerUi.addEventListener("swipe-up",(e)=>this.openPlayer())
    console.log("[ SOONE ]: player screen events loadaded")
  }
  search(query) {
    const searchContent = document.getElementById("search-content");
    const searchFilters = Array.from(document.getElementsByClassName("search-filters"));
    searchFilters.map((x)=> x.classList.add("minimize"))
      searchContent.innerHTML = `<div class="loader"></div>`
  
    if(!this.sooneKotlinWorking) {
      searchContent.innerHTML = `<div class="image-box"><img src="images/x_x.png"><h2>isso não funcionou... tente reiniciar o aplicativo</h2>`
      return;
    }
    
  }
  setSearchFilters() {
    const searchFilters = Array.from(document.getElementsByClassName("search-filters"));
    
    searchFilters.map((x)=> {
      x.addEventListener("click", () => {
        const matchContainer = x.querySelector("span");
        matchContainer.innerHTML = "matching " + x.id
        x.style.background = `var(--body)`
        if(this.searchFilter) !Array.isArray(this.searchFilter)? this.searchFilter = [this.searchFilter, x.id] : this.searchFilter.push(x.id)
        else this.searchFilter = x.id
        matchContainer.classList.add("show")
      })
    })
  }
  
  bigLyrics() {
    const lyrics = document.getElementsByClassName("lyrics-big")[0];
    if(!this.isLyricsLoaded) return;
    if(!lyrics.classList.contains("show")) {
    lyrics.classList.add("show");
    const lyricsOfContent = lyrics? this.lyrics.data.lines.map(x=>`<h4 class='lyrics-line'>${x.text}</h4>`).join("") : `<h2>It's look like who this song no has lyrics</h2>`
    lyrics.innerHTML = `<div class="lyrics-header">
    <img src="${this.currentSong.picture}">
    <div class="lyrics-header-infos">
    <h3>${this.currentSong.title}</h3>
    By ${this.currentSong.author}
    </div>
    </div>
    <div id='lyrics-content'>
    ${lyricsOfContent}
    </div>`
    lyrics.style.background = this.darkenRGBLevel(this.pictureColor, 3);
    if(this.lyrics.currentLine) document.getElementsByClassName("lyrics-line")[this.lyrics.currentLine.index].classList.add("in")
    } else {
    lyrics.classList.remove("show");
    /*lyrics.innerHTML = `<div id="lyrics-mini-content">${this.lyrics.currentLine? this.lyrics.currentLine.text : "lyrics of song"}</div>`
    lyrics.style.background = "linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))"*/
    }
  }
  debugOptions() {
    hideFunction();
    hableSheet({
      title: "<h2>Debug Player</h2>",
      content: `
      <div class="option"><i class="icon-bug_report option-icon"></i> Enable Logs <span></span></div>
      <div class="option"><i class="icon-science option-icon"></i> Advanced Diagnostic <span></span></div>
      <div class="option"
      ><i class="icon-content_copy option-icon"></i> Copy Execution Logs <span></span></div>
      <div class="option"><i class="icon-compare_arrows option-icon"></i> Copy API Logs <span></span></div>
      player debug is ONLY for testing with versions Beta and Pre, if you are seeing this, you can extract only execution logs infos
      `
    })
  }
  playerOptions() {
    hableSheet({
    title: `<div class="header-in-sheet">
      <img class="header-img" src="${this.track.picture}">
      <div class="infos">
      <h3 class="header-title">${this.track.title}</h3>${this.track.author}
      </div>`,
    content: `
    <div class="option" onclick="document.getElementsByClassName('song-code')[0].classList.add('show')"><i class="icon-karaoke option-icon"></i> Song code <span></span></div>
    <div class="option"><i class="icon-person option-icon"></i> About artist <span></span></div>
    <div class="option"><i class="icon-library_music option-icon"></i> About album <span></span></div>
    <div class="option" onclick="player.share()"><i class="icon-share option-icon"></i> Share <span></span></div>
    <div class="option"><i class="icon-phone option-icon"></i> Others devices <span></span></div>
    <div class="option" onclick="player.debugOptions()"><i class="icon-mic_external_on option-icon"></i> Karaoke Mode<span></span></div>
    <div class="option" onclick="player.debugOptions()"><i class="icon-bug_report option-icon"></i> Debug <span></span></div>
    `,
    touchYEvents: true,
    dimissOnExit: true,
    hideOnTouchOut: true
  })
  }
  setFavicons(favImg){
    let headTitle = document.querySelector('head');
    
    let favIcons = [
        { rel: 'apple-touch-icon' },
        { rel: 'apple-touch-startup-image' },
        { rel: 'shortcut icon' }
    ]
    
    favIcons.forEach(function(favIcon){
        let setFavicon = document.createElement('link');
        setFavicon.setAttribute('rel', favIcon.rel);
        setFavicon.setAttribute('href', favImg);
        headTitle.appendChild(setFavicon);
    });
}
  parseTime(time) {
    var countSeconds = parseInt(time % 60)
     var countMinutes = parseInt((time / 60) % 60)
     if(countSeconds < 10) countSeconds = `0${countSeconds}`
     if(countMinutes < 10) countMinutes = `0${countMinutes}`
     return countMinutes + ":" + countSeconds
  }
  getAverageColor(myImage) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 100;
    const height = (myImage.naturalHeight / myImage.naturalWidth) * width;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(myImage, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;
    let r = 0, g = 0, b = 0;
    let count = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];     
      g += imageData[i + 1]; 
      b += imageData[i + 2]; 
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    const averageColor = `RGB(${r}, ${g}, ${b})`;
    const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

    return averageColor
  }
  darkenRGBLevel(rgbString, level = 0) {
  const clamped = Math.max(0, Math.min(level, 10));
  const factor = 1 - (clamped / 10);
  const [r, g, b] = rgbString.match(/\d+/g).map(Number);

  const darkened = [r, g, b].map(c => Math.max(0, Math.floor(c * factor)));

  return `rgb(${darkened[0]}, ${darkened[1]}, ${darkened[2]})`;
}
  lightImage(imgElement, luminanceThreshold = 128) {
    if (!imgElement || !imgElement.complete) {
        throw new Error("O elemento <img> deve estar carregado (complete=true).");
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imgElement.naturalWidth;
    canvas.height = imgElement.naturalHeight;

    // 2. Desenhar a imagem no Canvas
    context.drawImage(imgElement, 0, 0);

    // 3. Acessar os dados de pixel
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const pixelCount = data.length / 4;

    let totalLuminance = 0;
    let totalSaturation = 0;

    // Constantes para cálculo de Luminância (ITU-R BT.709)
    const R_COEFF = 0.2126;
    const G_COEFF = 0.7152;
    const B_COEFF = 0.0722;

    // 4. Iterar sobre os pixels para calcular a média
    for (let i = 0; i < data.length; i += 4) {
        const R = data[i];     // Canal Vermelho
        const G = data[i + 1]; // Canal Verde
        const B = data[i + 2]; // Canal Azul

        // --- Cálculo de Luminância (Brilho Percebido) ---
        const luminance = (R_COEFF * R + G_COEFF * G + B_COEFF * B);
        totalLuminance += luminance;

        // --- Cálculo de Saturação (para o bônus) ---
        const max = Math.max(R, G, B);
        const min = Math.min(R, G, B);

        const saturation = max - min; // 0 (cinza) a 255 (cor pura)
        totalSaturation += saturation;
    }

    const mediaLuminancia = totalLuminance / pixelCount;
    const mediaSaturacao = totalSaturation / pixelCount;

    const resultado = mediaLuminancia >= luminanceThreshold ? 'light' : 'dark';

    return {
        result: resultado,
        luminance: mediaLuminancia,
        saturation: mediaSaturacao
    };
}
}