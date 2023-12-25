import anime from "animejs";

function orientation_change() {
  window.addEventListener("orientationchange", function () {
    document.body.style.opacity = "0";
    anime({
      targets: document.body,
      opacity: [0, 1],
      duration: window["scroll_duration"],
      easing: "easeOutCubic",
      delay: window["scroll_duration"] / 4
    });
  });
}

export { orientation_change };
