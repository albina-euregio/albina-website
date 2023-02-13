import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useState
} from "react";
import { useIntl } from "react-intl";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";

import {
  //placement,
  offset,
  flip,
  shift,
  useFloating,
  useInteractions,
  useFocus,
  useClick
} from "@floating-ui/react-dom-interactions";
import { motion, AnimatePresence } from "framer-motion";
export const DatePicker = ({
  children,
  value,
  placement = "bottom",
  onChange,
  maxDate
}) => {
  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();

  const { x, y, reference, floating, strategy, context, refs } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift({ padding: 5 })]
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    // useHover(context, {
    //   delay: { open: 200 },
    //   restMs: 40,
    //   handleClose: safePolygon()
    // }),
    useFocus(context),
    useClick(context, {
      keyboardHandlers: false
    })
  ]);

  const onClick = newValue => {
    console.log("onClick", newValue, value);

    setOpen(false);
    if (new Date(newValue).toISOString() != new Date(value).toISOString())
      onChange(newValue);
  };

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ ref: reference }))}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="albina-calendar-modal"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "just", damping: 20, stiffness: 300 }}
            ref={floating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              zIndex: 9999
            }}
            {...getFloatingProps()}
          >
            <Calendar
              className="albina-calendar-flesh"
              onChange={value => onClick(value)}
              maxDate={maxDate}
              value={value}
            />
            <a
              className="pure-button albina-calendar-close"
              role="button"
              tabIndex={0}
              onClick={() => setOpen(false)}
            >
              <span>
                {intl.formatMessage({ id: "date-picker:close-button:caption" })}
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
