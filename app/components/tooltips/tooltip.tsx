import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useState
} from "react";

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
  enableClick = false
}: {
  children: React.ReactNode;
  label: React.ReactNode | (() => React.ReactNode) | string;
  placement?: "bottom";
  html?: boolean;
  enableClick?: boolean;
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
      handleClose: safePolygon()
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
      {open && (
        <div
          {...getFloatingProps({
            ref: floating,
            className: "tooltip-container",
            style: {
              position: strategy,
              top: y ?? "",
              left: x ?? ""
            }
          })}
        >
          <div className={html ? "tooltip-inner-html" : "tooltip-inner"}>
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
        </div>
      )}
    </>
  );
};
