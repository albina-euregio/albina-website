import React, { useCallback, useEffect, useMemo } from "react";
import { useSwipeable } from "react-swipeable";

/** Horizontal swipe distance in px that counts as a flip. */
const SWIPE_DELTA = 100;

type SwipeDirection = "left" | "right";

export interface DialogFlipper<T> {
  /** Position of the shown item within `items`, `-1` if it is not part of them. */
  index: number;
  previousItem: T | undefined;
  nextItem: T | undefined;
  previous: () => void;
  next: () => void;
  /** Spread onto the element that should flip on horizontal swipes. */
  swipeHandlers: ReturnType<typeof useSwipeable>;
}

interface Options {
  /**
   * Vetoes a swipe, e.g. while the swiped element still has content to scroll
   * into view in that direction.
   */
  canSwipe?: (direction: SwipeDirection) => boolean;
}

/**
 * Flips a dialog through `items` via arrow keys, swipes and the caller's own
 * controls ({@link DialogFlipperButtons}). Call this from a component that is
 * only mounted while the dialog is open, so the key handler is scoped to it.
 *
 * The order is the caller's: pass the list in the order the flipper should walk it.
 */
export function useDialogFlipper<T extends { id: string }>(
  items: T[],
  id: string,
  setId: (id: string) => void,
  { canSwipe }: Options = {}
): DialogFlipper<T> {
  const index = useMemo(
    () => items.findIndex(item => item.id === id),
    [items, id]
  );
  const previousItem = index > 0 ? items[index - 1] : undefined;
  const nextItem = index >= 0 ? items[index + 1] : undefined;

  const previous = useCallback(() => {
    if (previousItem) setId(previousItem.id);
  }, [previousItem, setId]);

  const next = useCallback(() => {
    if (nextItem) setId(nextItem.id);
  }, [nextItem, setId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        previous();
      } else if (event.key === "ArrowRight") {
        next();
      } else {
        return;
      }
      event.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [previous, next]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (canSwipe?.("left") ?? true) && next(),
    onSwipedRight: () => (canSwipe?.("right") ?? true) && previous(),
    delta: SWIPE_DELTA
  });

  return { index, previousItem, nextItem, previous, next, swipeHandlers };
}

/** Previous/next arrows, placed in the top right corner of the dialog. */
export const DialogFlipperButtons: React.FC<{
  flipper: DialogFlipper<unknown>;
  previousLabel: string;
  nextLabel: string;
}> = ({ flipper, previousLabel, nextLabel }) => (
  <div className="modal-flipper">
    <button
      type="button"
      className="modal-flipper__button"
      disabled={!flipper.previousItem}
      title={previousLabel}
      aria-label={previousLabel}
      onClick={flipper.previous}
    >
      <span className="icon-arrow-left" aria-hidden="true" />
    </button>
    <button
      type="button"
      className="modal-flipper__button"
      disabled={!flipper.nextItem}
      title={nextLabel}
      aria-label={nextLabel}
      onClick={flipper.next}
    >
      <span className="icon-arrow-right" aria-hidden="true" />
    </button>
  </div>
);
