import fluidvids from "fluidvids.js";

function video_init() {
  setTimeout(() => {
    // console.log("video_init");

    fluidvids.init({
      selector: [".fitvids iframe"], // runs querySelectorAll()
      players: ["www.youtube.com", "player.vimeo.com"] // players to support
    });

    setTimeout(() => {
      const items = document.getElementsByTagName("iframe");

      for (let item of items) {
        item.classList.remove("displayNone");
        // console.log("video_init #1", item);
      }
    }, 100);
  }, 100);
}

export { video_init };
