import "./tooltip.css";
import { computePosition, flip, shift, offset } from "@floating-ui/dom";

const tooltip_init = () => {
  const tp = document.querySelector("#tooltip-container");

  if (!tp) {
    console.error("Tooltip markup is missing!");
    return;
  }

  const tpContent = tp.querySelector(".tooltip-content");

  //console.log("tooltip_init1", tp, tpContent);
  const update = async el => {
    await computePosition(el, tp, {
      placement: "top",
      middleware: [offset(5), flip(), shift({ padding: 5 })]
    }).then(({ x, y }) => {
      Object.assign(tp.style, {
        left: `${x}px`,
        top: `${y}px`
      });
    });
  };

  const showTooltip = el => {
    //console.log("showTooltip", el);
    tpContent.innerHTML = el.getAttribute("title");
    tp.style.display = "block";
    el.setAttribute("data-title", el.title);
    el.title = "";
    update(el, tp);
  };

  const hideTooltip = el => {
    //console.log("hideTooltip", el);
    tp.style.display = "none";

    el.title = el.getAttribute("data-title");
    el.setAttribute("data-title", "");
  };

  const tooltips = document.querySelectorAll(
    ".tooltip:not([data-toolip-init])"
  );

  if (tooltips.length) {
    tooltips.forEach(el => {
      if (el.hasAttribute("data-toolip-init")) return;
      //console.log("addTootip for", el);

      el.setAttribute("data-toolip-init", "true");
      [
        ["mouseenter", showTooltip.bind(null, el)],
        ["mouseleave", hideTooltip.bind(null, el)],
        ["focus", showTooltip.bind(null, el)],
        ["blur", hideTooltip.bind(null, el)]
      ].forEach(([event, listener]) => {
        el.addEventListener(event, listener);
      });
    });
  }
};

export { tooltip_init };
