function enableSwipeEvents(element, options = {}) {
  let startX = 0, startY = 0;
  let longPressTimer = null;

  const threshold = options.threshold || 5;

  const isSwipe = (delta) => Math.abs(delta) > threshold;

  const getDirection = (dx, dy) => {
    return Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? "swipe-right" : "swipe-left")
      : (dy > 0 ? "swipe-down" : "swipe-up");
  };

  // Bloqueia long-press nativo (context menu, seleção)
  ["contextmenu", "selectstart"].forEach(event =>
    element.addEventListener(event, e => e.preventDefault())
  );

  element.addEventListener("touchstart", (e) => {
    const touch = e.changedTouches[0];
    startX = touch.screenX;
    startY = touch.screenY;

    // Impede long press
    longPressTimer = setTimeout(() => {
      e.preventDefault();
    }, 200);
  }, { passive: false });

  element.addEventListener("touchend", (e) => {
    clearTimeout(longPressTimer);

    const touch = e.changedTouches[0];
    const endX = touch.screenX;
    const endY = touch.screenY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (!isSwipe(deltaX) && !isSwipe(deltaY)) return;

    const direction = getDirection(deltaX, deltaY);

    const swipeEvent = new CustomEvent(direction, {
      detail: { startX, startY, endX, endY, deltaX, deltaY, direction }
    });

    element.dispatchEvent(swipeEvent);
  });
}