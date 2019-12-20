import fluidvids from "fluidvids.js";

function video_init() {
  setTimeout(() => {
    console.log("setTimeout");
    const items = document.getElementsByTagName("iframe");

    for (let item of items) {
      item.classList.remove("displayNone");
    }

    fluidvids.init({
      selector: [".fitvids iframe"], // runs querySelectorAll()
      players: ["www.youtube.com", "player.vimeo.com"] // players to support
    });
  }, 300);
}

export { video_init };
