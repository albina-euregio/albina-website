import L from "leaflet";
import { MapControl, PropTypes as LeafletPropTypes } from "react-leaflet";
import createTimeSelector from "../leaflet/L.Control.Time";

export default class TimeControl extends MapControl {
  createLeafletElement(props) {
    return createTimeSelector(props);
  }
}
