let pages = [
  `<h2 class="page-title">HISTORY</h2> 
  <hr> 
  <div class="image-box">
  <img src="images/no-history.png">
  <h2>Ainda não ouviu nada...</h2>
  </div>
  
  `,
  `
  <h2 class="page-title">SEARCH</h2>
  <hr>
  <span id="search-content">
  <div class="image-box">
  <img src="images/x_x.png">
  <h2>Sem pesquisas aqui...</h2>
  </div>
  </span>
  `,
  `<img src="images/no-history.png" style="width: 40px"><h2>Fail to load</h2>`, // main
  `<h2 class="page-title">OFFLINE</h2> 
  <hr>
  
  <div class="image-box">
  <img src="images/x_x.png">
  <h2>Sem músicas baixadas...</h2>
  </div>`
  ]
function selectPage(pageIndex) {
  const pageContent = document.getElementsByClassName("page-content")[0];
  const navBar = document.getElementsByClassName("nav-bar")[0];
  const navIcons = Array.from(navBar.getElementsByClassName("nav-icon"));
  pageContent.classList.add("nextPage")
  if(pageIndex==1) {
        notificationPopup('searching...')
        navBar.initialIcons = navBar.innerHTML;
        navBar.classList.add('onsearch')
        navBar.innerHTML = `
        <div class="textbox-container">
         <i class="icon-search"></i><input placeholder="search" id="a" type="search" onkeydown="if(event.keyCode == 13 && this.value) sooneInterface.search(this.value)">
        </div>
        `
        sooneInterface.searchFilter = null
        if(sooneInterface.playerLoaded) sooneInterface.miniPlayerUi.classList.add("isSearching")
      }
  if(!pages[2]) pages[2] = pageContent.innerHTML;
  if(pageIndex==4) subNav();
  navIcons.map(x=>x.classList.remove("selected"));
  navIcons[pageIndex].classList.add("selected")
  pageContent.innerHTML = pages[pageIndex] 
  if(pageIndex==1) sooneInterface.setSearchFilters()
  setTimeout(()=>pageContent.classList.remove("nextPage"),200)
}
function backToAfterPage() {
      const navBar = document.getElementsByClassName("nav-bar")[0];
      const notify = document.getElementsByClassName("header")[0];
      navBar.innerHTML = navBar.initialIcons
      navBar.classList.remove("onsearch")
      notificationPopup();
      sooneInterface.searchFilter = null
      if(sooneInterface.playerLoaded) sooneInterface.miniPlayerUi.classList.remove("isSearching")
    }
function notificationPopup(contentOfNotification) {
      const notificationPopupEl = document.getElementsByClassName("notification-popup")[0];
      const content = notificationPopupEl.getElementsByClassName("notification-content")[0];
      
      if(!notificationPopupEl.classList.contains("show")) {
        content.innerHTML = contentOfNotification
        content.style.width = content.scrollWidth + "px"
        notificationPopupEl.classList.add("show");
      } else {
        content.innerHTML = "";
        notificationPopupEl.classList.remove("show")
      }
    }

/* next update update
  @ alerts with image
  <div class="image-box">
  <img src="images/x_x.png">
  <h2>Sem músicas baixadas...</h2>
  </div>
  
  @ search filter 
  <div class="search-filters vel" id="another source" style="bottom: 210px"><i class="icon-call_merge"></i> <span></span></div>
  <div class="search-filters vel" id="IA"><i class="icon-auto_awesome"></i> <span></span></div>
  
  @ search item
  <span id="search-content">
  <div class="search-box">
  <div class="search-topic vel"></div>
  <div class="search-topic vel"></div>
  <div class="search-topic vel"></div>
  <div class="search-topic vel"></div>
  </div>
  </span>
  */