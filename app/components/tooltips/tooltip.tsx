import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";

type Side = "top" | "bottom" | "left" | "right";
type Alignment = "start" | "end";
type Placement = Side | `${Side}-${Alignment}`;

const OPEN_DELAY = 200;
const CLOSE_DELAY = 100;

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return value => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(value);
      else if (ref) (ref as React.RefObject<T | null>).current = value;
    }
  };
}

function sizeStyle(width: string | number | undefined): React.CSSProperties {
  if (!width) return {};
  const value = typeof width === "number" ? `${width}px` : width;
  return { width: value, maxWidth: value };
}

export const Tooltip = ({
  children,
  label,
  placement = "bottom",
  html = false,
  enableClick = false,
  width, //note if you change the width of the tooltip. check with mobile view to make sure it is not too wide.
  zIndex
}: {
  children: React.ReactNode;
  label: React.ReactNode | (() => React.ReactNode) | string;
  placement?: Placement;
  html?: boolean;
  enableClick?: boolean;
  width?: string | number;
  zIndex?: number;
}) => {
  const rawId = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const anchorName = `--tooltip-${rawId}`;
  const tooltipId = `tooltip-${rawId}`;

  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const referenceRef = useRef<Element>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  };

  const show = (immediate = false) => {
    clearTimers();
    const el = popoverRef.current;
    if (!el || el.matches(":popover-open")) return;
    if (immediate) el.showPopover();
    else openTimer.current = setTimeout(() => el.showPopover(), OPEN_DELAY);
  };

  const hideImmediate = () => {
    clearTimers();
    const el = popoverRef.current;
    if (el?.matches(":popover-open")) el.hidePopover();
  };

  const scheduleHide = () => {
    clearTimers();
    closeTimer.current = setTimeout(hideImmediate, CLOSE_DELAY);
  };

  useEffect(() => clearTimers, []);

  // native light-dismiss (outside click / Escape), independent of trigger element type
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (referenceRef.current?.contains(target)) return;
      hideImmediate();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideImmediate();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const child = isValidElement(children)
    ? (children as React.ReactElement<{
        ref?: React.Ref<Element>;
        style?: React.CSSProperties;
        onPointerEnter?: (e: React.PointerEvent) => void;
        onPointerLeave?: (e: React.PointerEvent) => void;
        onFocus?: (e: React.FocusEvent) => void;
        onBlur?: (e: React.FocusEvent) => void;
        onClick?: (e: React.MouseEvent) => void;
      }>)
    : null;

  const ref = useMemo(
    () => mergeRefs(referenceRef, child?.props.ref),
    [child?.props.ref]
  );

  if (!child) return null;

  const referenceProps: React.HTMLAttributes<Element> & {
    ref: React.RefCallback<Element>;
  } = {
    ref,
    style: { anchorName, ...child.props.style },
    "aria-describedby": tooltipId,
    onPointerEnter: e => {
      child.props.onPointerEnter?.(e);
      if (e.pointerType === "mouse") show();
    },
    onPointerLeave: e => {
      child.props.onPointerLeave?.(e);
      if (e.pointerType === "mouse") scheduleHide();
    },
    onFocus: e => {
      child.props.onFocus?.(e);
      show(true);
    },
    onBlur: e => {
      child.props.onBlur?.(e);
      hideImmediate();
    },
    onClick: e => {
      child.props.onClick?.(e);
      if (enableClick) popoverRef.current?.togglePopover();
    }
  };

  const widthStyle = sizeStyle(width);

  return (
    <>
      {cloneElement(child, referenceProps)}
      {createPortal(
        <div
          id={tooltipId}
          ref={popoverRef}
          popover="manual"
          role="tooltip"
          data-placement={placement}
          onToggle={e => setOpen(e.newState === "open")}
          onPointerEnter={clearTimers}
          onPointerLeave={scheduleHide}
          className="tooltip-container"
          style={{
            positionAnchor: anchorName,
            ...(typeof zIndex !== "undefined" ? { zIndex } : {}),
            ...widthStyle
          }}
        >
          <div
            className={html ? "tooltip-inner-html" : "tooltip-inner"}
            style={widthStyle}
          >
            {typeof label === "string" ? (
              <div
                className="tooltip-content"
                dangerouslySetInnerHTML={{
                  __html: label.replace("\n", "<br>")
                }}
              ></div>
            ) : typeof label === "function" ? (
              <div className="tooltip-content">{label()}</div>
            ) : (
              <div className="tooltip-content">{label}</div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
