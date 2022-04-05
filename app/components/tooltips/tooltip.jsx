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
  useDismiss
} from "@floating-ui/react-dom-interactions";
import { motion, AnimatePresence } from "framer-motion";

export const Tooltip = ({ children, label, placement = "bottom" }) => {
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
      restMs: 40
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
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "just", damping: 20, stiffness: 300 }}
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
            <div className="tooltip-wrapper">
              <div className="tooltip-inner">
                <div className="tooltip-content">{label}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
