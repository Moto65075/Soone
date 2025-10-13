let pages = [
  `<h2>NOTIFICATIONS</h2>`,
  `
  <h2>SEARCH</h2>
  <hr>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  <div class="search-card">
  <h3>POP</h3>
  </div>
  `,
  ``, // main
  ``,
  ``
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
         <i class="icon-search"></i><input placeholder="search" type="search">
        </div>
        `
      }
  if(!pages[3]) pages[3] = pageContent.innerHTML;
  if(pageIndex==4) subNav();
  navIcons.map(x=>x.classList.remove("selected"));
  navIcons[pageIndex].classList.add("selected")
  pageContent.innerHTML = pages[pageIndex] 
  setTimeout(()=>pageContent.classList.remove("nextPage"),200)
}

function backToAfterPage() {
      const navBar = document.getElementsByClassName("nav-bar")[0];
      const notify = document.getElementsByClassName("header")[0];
      navBar.innerHTML = navBar.initialIcons
      navBar.classList.remove("onsearch")
      notificationPopup();
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