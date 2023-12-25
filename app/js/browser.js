function orientation_change() {
  window.addEventListener("orientationchange", () => {
    document.body.animate(
      [
        { opacity: "0", easing: "ease-out" },
        { opacity: "1", easing: "ease-out" }
      ],
      {
        duration: window["scroll_duration"]
      }
    );
  });
}

export { orientation_change };
