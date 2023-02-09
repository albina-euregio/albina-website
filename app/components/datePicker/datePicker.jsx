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
  autoUpdate,
  useFloating,
  useInteractions,
  useFocus,
  useClick
} from "@floating-ui/react-dom-interactions";

export const DatePicker = ({
  children,
  value,
  placement = "bottom",
  onChange,
  maxDate
}) => {
  const [isOpen, setOpen] = useState(false);
  const intl = useIntl();
  const { x, y, reference, floating, strategy, context, refs, update } =
    useFloating({
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

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && isOpen) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [refs.reference, refs.floating, update, isOpen]);

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ ref: reference }))}
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 9999
          }}
          {...getFloatingProps()}
        >
          <Calendar
            onChange={value => {
              setOpen(false);
              onChange(value);
            }}
            maxDate={maxDate}
            value={value}
          />
          <div
            onClick={() => setOpen(false)}
            style={{
              backgroundColor: "grey",
              textAlign: "center",
              color: "white",
              padding: "4px"
            }}
          >
            {intl.formatMessage({ id: "date-picker:close-button:caption" })}
          </div>
        </div>
      )}
    </>
  );
};
