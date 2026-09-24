import { useEffect, useRef } from "react";

/** Lets a horizontally scrolling strip be dragged with the mouse like a
 * touch swipe. Suppresses the click that would otherwise fire on the item
 * under the cursor once a drag has actually moved it. */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      drag.current = {
        active: true,
        moved: false,
        startX: e.clientX,
        startLeft: el.scrollLeft
      };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.startX;
      if (Math.abs(dx) > 3) {
        drag.current.moved = true;
        el.style.scrollSnapType = "none";
      }
      el.scrollLeft = drag.current.startLeft - dx;
    };
    const onUp = () => {
      drag.current.active = false;
      el.style.scrollSnapType = "";
    };
    const onClick = (e: MouseEvent) => {
      if (drag.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        drag.current.moved = false;
      }
    };
    const onDragStart = (e: Event) => e.preventDefault();
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return ref;
}
