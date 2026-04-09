import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useState
} from "react";
import { createPortal } from "react-dom";

import {
  //placement,
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  useRole,
  useClick,
  useDismiss,
  safePolygon
} from "@floating-ui/react-dom-interactions";

export const Tooltip = ({
  children,
  label,
  placement = "bottom",
  html = false,
  enableClick = false,
  width,  //note if you change the width of the tooltip. check with mobile view to make sure it is not too wide.
  zIndex
}: {
  children: React.ReactNode;
  label: React.ReactNode | (() => React.ReactNode) | string;
  placement?: "bottom";
  html?: boolean;
  enableClick?: boolean;
  width?: string | number;
  zIndex?: number;
}) => {
  const [open, setOpen] = useState(false);
  const { x, y, reference, floating, strategy, context, refs, update } =
    useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      middleware: [offset(10), flip(), shift({ padding: 5 })]
    });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      delay: { open: 200 },
      restMs: 40,
      mouseOnly: true,
      handleClose: safePolygon({ blockPointerEvents: false })
    }),
    useClick(context, {
      enabled: enableClick
    }),
    useFocus(context),
    useRole(context, { role: "tooltip" }),
    useDismiss(context)
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, open]);

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ ref: reference }))}
      {open && createPortal(
        <div
          {...getFloatingProps({
            ref: floating,
            className: "tooltip-container",
            style: {
              position: strategy,
              top: y ?? "",
              left: x ?? "",
              ...(typeof zIndex !== 'undefined' ? { zIndex } : {}),
              ...(width ? { width: typeof width === "number" ? `${width}px` : width, maxWidth: typeof width === "number" ? `${width}px` : width } : {})
            }
          })}
        >
          <div
            className={html ? "tooltip-inner-html" : "tooltip-inner"}
            style={width ? { width: typeof width === "number" ? `${width}px` : width, maxWidth: typeof width === "number" ? `${width}px` : width } : undefined}
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
