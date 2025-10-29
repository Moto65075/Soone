const config = {
  apiBaseUrl: "http://192.168.100.12:8080/api/v4",
  userId: "1234567891018827300",
  authToken: "Bearer 123456789",
};

let track = {
  public: true,
  title: "",
  id: "",
  picture: "",
  thumbnail: "",
  lyrics: "",
  artist: "",
  album: "",
  explicit: false,
  keywords: [],
  language: "",
  duration: "",
  track_number: "",
  ISRC: "Karaoke",
  upload: {
    quality: "50",
  },
};

let album = {};
let itemsAttachedCount = 0;
const demo = new Audio();

const generateId = (length = 15) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const generateNumerId = (length = 16) => {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
};

const allowToPost = () => {
  const postButton = document.querySelector(".button-post");
  if (postButton) {
    postButton.classList.remove("hided");
  }
};

demo.onplay = () => {
  const demoPlay = document.querySelector(".demo-play");
  if (demoPlay) {
    document.title = "Playing Demo";
    demoPlay.classList.remove("icon-play_arrow");
    demoPlay.classList.add("icon-pause");
  }
};

demo.onpause = () => {
  const demoPlay = document.querySelector(".demo-play");
  if (demoPlay) {
    document.title = "";
    demoPlay.classList.remove("icon-pause");
    demoPlay.classList.add("icon-play_arrow");
  }
};

async function createAlbum() {
  const albumArea = document.getElementById("albums");
  album.id = generateId();

  try {
    const coverUploadRes = await fetch(`${config.apiBaseUrl}/user/uploader`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "covers",
        filename: album.filename,
        mime: album.mime,
        fileBites: album.cover,
      }),
    }).then((res) => res.json());

    delete album.cover;
    const { filename, mime } = album;
    delete album.filename;
    delete album.mime;

    const albumData = {
      title: album.title,
      cover: `${filename}.${mime}`,
      releaseDate: new Date(album.releaseDate).getTime(),
      id: album.id,
      tracks: [],
      artist: config.userId,
      duration: 0,
      tags: [],
      genre: album.genre,
      visibility: true,
      created: new Date().getTime(),
    };

    const createAlbumRes = await fetch(`${config.apiBaseUrl}/album`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(albumData),
    }).then((res) => res.json());

    console.log("Create Album Response:", createAlbumRes);
    console.log("Upload Cover Response:", coverUploadRes);

    albumArea.innerHTML = `
      <div class="album glass trackAlbum">
        <img src="${config.apiBaseUrl}/album/${album.id}/art" alt="album art">
        <div class="infos">
          <h4>${album.title}</h4>
          <p>Album release in ${album.releaseDate}</p>
        </div>
        <i class="icon-navigate_next"></i>
      </div>`;
    hideFunction();
  } catch (error) {
    console.error("Failed to create album:", error);
  }
}

function selectAlbum(albumId, item) {
  document.querySelectorAll(".album").forEach(el => el.classList.remove("trackAlbum"));
  item.classList.add("trackAlbum");
  track.album = albumId;
}

function attachTrackItem(input) {
  const attachCount = document.getElementById("attachCount");
  const uploadDescription = document.querySelector(".description h4");
  const uploadTrackItemsDemoArea = document.getElementById("upload-track-items-demo-area");
  const attachInput = document.getElementById("attachArea");

  if (!input.files.length) return;

  const file = input.files[0];
  const reader = new FileReader();

  const attachmentSlots = {
    artwork: { next: "picture", accept: "image/*", description: "Now Picture" },
    picture: { next: "lyrics", accept: "text/plain", description: "Upload Lyrics" },
    lyrics: { next: "audio", accept: "audio/mpeg", description: "Now Audio" },
    audio: { next: null, accept: null, description: "All done!" },
  };

  let currentSlotKey;
  if (!track.thumbnail) currentSlotKey = "artwork";
  else if (!track.picture) currentSlotKey = "picture";
  else if (!track.lyrics) currentSlotKey = "lyrics";
  else if (!track.audio) currentSlotKey = "audio";
  else {
    console.warn("All attachment slots are filled.");
    return;
  }
  
  const currentSlot = attachmentSlots[currentSlotKey];

  reader.onload = (e) => {
    const base64 = e.target.result;
    const mimeType = file.type.split("/")[0];

    if (currentSlotKey === "artwork" && mimeType === "image") track.thumbnail = base64;
    else if (currentSlotKey === "picture" && mimeType === "image") track.picture = base64;
    else if (currentSlotKey === "lyrics" && file.type === "text/plain") track.lyrics = base64;
    else if (currentSlotKey === "audio" && mimeType === "audio") {
      track.audio = base64;
      demo.src = base64;
    } else {
      console.error(`Invalid file type for slot: ${currentSlotKey}`);
      return;
    }

    itemsAttachedCount++;

    attachCount.innerHTML = `Attached (${itemsAttachedCount}/4)`;
    uploadDescription.innerHTML = currentSlot.description;
    if (currentSlot.accept) {
      attachInput.accept = currentSlot.accept;
    }

    const icon = mimeType === "image" ? "insert_photo" : mimeType === "audio" ? "music_note" : "upload_file";
    
    uploadTrackItemsDemoArea.innerHTML += `
      <div class="upload-item glass" id="${currentSlotKey}">
        <i class="icon-${icon}"></i> 
        <h4>${file.name}</h4>
        ${currentSlotKey}
        ${mimeType === "audio" ? `<i class="icon-play_arrow demo-play" onclick="demo.paused ? demo.play() : demo.pause()"></i>` : ""}
        <i class="icon-clear" onclick="removeTrackItem('${currentSlotKey}')"></i>
      </div>`;
  };

  reader.readAsDataURL(file);
}

function removeTrackItem(itemKey) {
  const attachedElement = document.getElementById(itemKey);
  const attachCount = document.getElementById("attachCount");
  const uploadDescription = document.querySelector(".description h4");
  const attachInput = document.getElementById("attachArea");

  const trackKeyMap = {
    artwork: "thumbnail",
    picture: "picture",
    lyrics: "lyrics",
    audio: "audio",
  };

  const trackProperty = trackKeyMap[itemKey];
  if (!trackProperty || track[trackProperty] === null) {
    console.warn(`Item '${itemKey}' not found or already removed.`);
    return;
  }

  if (attachedElement) attachedElement.remove();

  track[trackProperty] = null;
  itemsAttachedCount--;

  attachCount.innerHTML = `Attached (${itemsAttachedCount}/4)`;

  const uploadInfo = {
    audio: { description: "Now Audio", accept: "audio/mpeg" },
    lyrics: { description: "Upload Lyrics", accept: "text/plain" },
    picture: { description: "Now Picture", accept: "image/*" },
    artwork: { description: "Upload Artwork", accept: "image/*" },
  };

  if (uploadInfo[itemKey]) {
    uploadDescription.innerHTML = uploadInfo[itemKey].description;
    attachInput.accept = uploadInfo[itemKey].accept;
  }
  if (itemKey === "audio") {
    demo.src = "";
  }
}

function addKeyword() {
  const keywordContainer = document.querySelector(".keywords");
  if (keywordContainer.querySelector("input[disabled]")) {
    keywordContainer.innerHTML = "";
  }
  keywordContainer.innerHTML += `<input type="text" class="keyword glass" placeholder="Enter a keyword...">`;
}

function confirmation() {
  const albumInfo = track.album ? `Part of the album <strong>${track.album.title}</strong>, ` : "";
  hableSheet({
    title: `<h3>You are about to post</h3>`,
    content: `Your creation <strong>${track.title}</strong> is about to reach listeners worldwide. ${albumInfo}this track with relaxing <strong>Lo-Fi</strong> Chill tones is almost out. Confirm to bring this song experience to life.
      <div class="button glass">See more</div>
      <div class="button" onclick="post()">Next</div>`,
  });
}

function providor(audio_providor) {
  const providorOutput = document.getElementById("providor");
  
  providorOutput.innerHTML = `<div class="providor">Audio provided By <img src="build/images/mpkaok.svg" style="width: 70px; height: 70px"></div>`
  setTimeout(()=>providorOutput.innerHTML += `<div class="textarea glass"><select><option>Podcast</option></select></div>`,200)
}

function attachAlbumImage(input) {
  if (!input.files || !input.files[0]) return;
  const albumImage = document.getElementById("albumImage");
  const reader = new FileReader();
  const file = input.files[0];

  album.mime = file.type.split("/")[1];
  album.filename = generateNumerId();

  reader.onload = (e) => {
    albumImage.src = e.target.result;
    album.cover = e.target.result;
  };
  reader.readAsDataURL(file);
}

async function post() {
  hableSheet({ title: `<h3>Starting...</h3>`, content: `managing inputs...` });

  const uploadFile = async (label, index, type, fileBites, mime) => {
    hableSheet({
      title: `<h3>Uploading (${index}/4)</h3>`,
      content: `Uploading ${label}...<div class='progressBox glass'><span id='progress'></span></div>`,
    });
    
    const filename = generateNumerId();
    track[label.toLowerCase()] = filename;

    const response = await fetch(`${config.apiBaseUrl}/user/uploader`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.authToken,
      },
      body: JSON.stringify({
        type,
        fileBites,
        filename,
        mime,
      }),
    }).then(res => res.json());

    if (response.status !== 200) {
      hableSheet({
        title: `<h3>Failed to Upload ${label}</h3>`,
        content: `It looks like the upload failed. ${response.message}<div class="button">report error</div>`,
        hideOnTouchOut: true,
      });
      throw new Error(`Upload failed: ${label}`);
    }
    return response;
  };

  try {
    await uploadFile("thumbnail", 1, "thumbnails", track.thumbnail, "jpg");
    await uploadFile("picture", 2, "pictures", track.picture, "jpg");
    await uploadFile("lyrics", 3, "lyrics", track.lyrics, "txt");
    await uploadFile("audio", 4, "audios", track.audio, "mp3");

    hableSheet({ title: `<h3>Files Sent!</h3>`, content: `All files were successfully uploaded! Now creating the track.` });

    track.id = generateId(15);
    track.keywords = Array.from(document.querySelectorAll(".keywords input")).map(input => input.value);
    track.duration = demo.duration;
    track.language = navigator.language;
    delete track.upload;

    const createTrackResponse = await fetch(`${config.apiBaseUrl}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(track),
    }).then(res => res.json());

    console.log("Track creation response:", createTrackResponse);
    hableSheet({
        title: `<h3>Success to Post ${track.title}!</h3>`,
        content: ``,
        hideOnTouchOut: true,
      });
  } catch (error) {
    console.error("An error occurred during the post process:", error);
    hableSheet({
        title: `<h3>Failed to Labeling</h3>`,
        content: `It looks like labeling have not successfully. ${error}<div class="button">report error</div>`,
        hideOnTouchOut: true,
      });
  }
}

const checkReadyInterval = setInterval(() => {
  const keywordCount = document.querySelectorAll(".keywords .keyword").length;
  const trackTitle = document.getElementById("track-title").value;

  if (keywordCount > 2 && track.thumbnail && track.picture && track.lyrics && track.audio && trackTitle) {
    allowToPost();
    clearInterval(checkReadyInterval);
  }
}, 500);

const askAlbum = () => {
  hableSheet({
    title: `<h3>Create Album</h3>`,
    content: `
      Create your album to group your works.
      <h4>Album Name:</h4>
      <div class="textarea glass">
        <i class="icon-music_note glass"></i>
        <input type="text" style="font-weight: bold" placeholder="Album title..." oninput="album.title = this.value">
      </div>
      <br>
      <h4>Album Release Date:</h4>
      <div class="textarea glass">
        <i class="icon-calendar_today glass"></i>
        <input type="date" style="font-weight: bold" onchange="album.releaseDate = this.value">
      </div>
      <br>
      <h4>Album Picture:</h4>
      <label for="albumAttach" class="album-pic">
        <img src="build/images/karaoke.png" id="albumImage">
        <i class="icon-add glass"></i>
      </label>
      <input type="file" id="albumAttach" onchange="attachAlbumImage(this)" accept="image/*" style="display:none;">
      <br><br>
      <h4>Album Genre:</h4>
      <div class="textarea glass">
        <i class="icon-album glass"></i>
        <select onchange="album.genre = this.value">
          <option value="pop">Pop</option>
          <option value="gospel">Gospel</option>
        </select>
      </div>
      <br><br>
      <div class="button" onclick="createAlbum()">Create</div>`,
    hideOnTouchOut: true,
  });
};

const loadAlbums = async () => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/user/${config.userId}/albums`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: config.authToken,
      },
    }).then(res => res.json());

    const albumsContainer = document.getElementById("albums");
    if (response.result && response.result.length > 0) {
      albumsContainer.innerHTML = response.result.map(album => `
        <div class="album glass" onclick="selectAlbum('${album.id}', this)">
          <img src="${config.apiBaseUrl}/album/${album.id}/art" crossorigin="anonymous" alt="album art">
          <div class="infos">
            <h4>${album.title}</h4>
            <p>album ${album.tracks.length} tracks</p>
          </div>
        </div>`).join("");
    } else {
      albumsContainer.innerHTML = `<p>no albums herr...</p>`;
    }
  } catch (error) {
    console.error("Error fetching albums:", error);
    document.getElementById("albums").innerHTML = `<p>Disjoin, error to load your albums.</p>`;
  }
  
  const langCode = navigator.language.split('-')[1] || navigator.language;
  document.getElementById("lang").innerHTML = `
    <img src="https://flagsapi.com/${langCode.toUpperCase()}/flat/64.png" class="countryFlag" alt="${langCode} flag">
    &ensp;<h2>${navigator.language}</h2>`;
};

window.onload = loadAlbums