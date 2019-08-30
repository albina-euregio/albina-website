import fluidvids from "fluidvids.js";

function video_init() {
	fluidvids.init({
		selector: [".fitvids iframe"], // runs querySelectorAll()
		players: ["www.youtube.com", "player.vimeo.com"] // players to support
	});
}

export { video_init }
