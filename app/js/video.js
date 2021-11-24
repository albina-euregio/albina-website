import fluidvids from "../js/fluidvids";

function video_init() {
  setTimeout(() => {
    // console.log("video_init");

    fluidvids.init({
      selector: [".fitvids iframe"], // runs querySelectorAll()
      players: ["www.youtube.com", "player.vimeo.com"] // players to support
    });
  }, 100);
}

export { video_init };
