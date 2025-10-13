function hableSheet(sheetInfos) {
    const bottomSheet = document.querySelector(".bottom-sheet");
    const bottomSheetTitle = bottomSheet.querySelector(".bottom-sheet-title");
    const bottomSheetContent = document.getElementById("bottom-sheet-content");
    const bottomSheetBodyHiden = document.querySelector(".bottom-sheet-body-hiden");
    const bottomSheetInteragerArea = bottomSheet.querySelector(".bottom-sheet-interager-area");
    if(!bottomSheet || !bottomSheetTitle || !bottomSheetContent) throw new Error("[ SHEET ]: some elements of sheet coud not be found in DOM")
    if(!sheetInfos) throw new Error("[ SHEET ]: Infos is empty!")
    const { title, content, hideOnTouchOut, hideInTime, hideWhenIwant, dimissOnExit, touchYEvents } = sheetInfos;
    if(hideInTime) {
      if(isNaN(hideInTime)) throw new TypeError("[ SHEET ]: hide in time is a number param!")
      setTimeout(hideFunction, hideInTime)
    } 
    else if(hideOnTouchOut) bottomSheetBodyHiden.onclick = hideFunction;
    if(touchYEvents) {
    let startY = 0;
    let startTop = 0;
    let isDragging = false;

bottomSheetInteragerArea.addEventListener('touchstart', (e) => {
  isDragging = true;
  startY = e.touches[0].clientY;
  startTop = bottomSheet.getBoundingClientRect().top;
}, { passive: true });
bottomSheetInteragerArea.addEventListener('touchmove', (e) => {
  if (!isDragging) return;

  const touchY = e.touches[0].clientY;
  let newTop = startTop + (touchY - startY);

  const minTop = window.innerHeight * 0.1;
  const maxTop = window.innerHeight * 0.7;
  if (newTop >= maxTop && dimissOnExit) hideFunction()
  newTop = Math.max(minTop, Math.min(newTop, maxTop));
  bottomSheet.style.top = `${newTop}px`;
}, { passive: true });
bottomSheetInteragerArea.addEventListener('touchend', () => {
  isDragging = false;
});
  }
    bottomSheetTitle.innerHTML = title;
    bottomSheetContent.innerHTML = content;
    document.body.style.overflow = "hidden"
    bottomSheetBodyHiden.classList.remove("hided")
    bottomSheet.classList.remove("hided");
    if(hideWhenIwant) return hideFunction
  }

const hideFunction = () => {
      const bottomSheet = document.getElementsByClassName("bottom-sheet")[0];
      const bottomSheetBodyHiden = document.getElementsByClassName("bottom-sheet-body-hiden")[0];
      document.body.style.overflow = "scroll"
      bottomSheet.classList.add("hided");
      bottomSheet.style.bottom = "none"
      bottomSheetBodyHiden.classList.add("hided");
    }