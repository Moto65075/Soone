

function userOptions() {
  hableSheet({
    title: `<div class="icon-in-sheet">
      <img class="icon-img-in-sheet" src="build/images/karaoke.png">
      <div class="infos">
      <h3 class="icon-in-sheet-title">You</h3>
      </div>`,
    content: `
    <div class="option"><i class="icon-settings option-icon"></i> Settings & Privacy <span></span></div>
    <div class="option"><i class="icon-person_add option-icon"></i> Add account <span></span></div>
    <div class="option"><i class="icon-star option-icon"></i> Premium<span></span></div>
    <div class="option"><i class="icon-leaderboard option-icon"></i> Activity <span></span></div>
    <div class="option danger"><i class="icon-logout option-icon"></i> Logout <span></span></div>
    `,
    hideOnTouchOut: true
  })
}