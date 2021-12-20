import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import SnowProfileStore from "../stores/snowProfileStore";
import LeafletMap from "../components/leaflet/leaflet-map";
import StationMarker from "../components/leaflet/station-marker";
import { AttributionControl } from "react-leaflet";

class SnowProfileMap extends React.Component {
  constructor(props) {
    super(props);
    this.store = new SnowProfileStore();
  }

  componentDidMount() {
    this.store.load();
  }

  render() {
    const { mapOptionsOverride } = config.weathermaps.settings;
    const overlays = this.store.profiles.map(profile => {
      return (
        <StationMarker
          className="tooltip"
          color={profile.$color}
          coordinates={profile.$latlng}
          iconAnchor={[12.5, 12.5]}
          itemId="any"
          key={`profile-${profile.id}`}
          onClick={() => this.store.openProfile(profile)}
          stationName={profile.$tooltip}
        />
      );
    });
    return (
      <>
        <section
          id="section-weather-map"
          className="section section-weather-map"
        >
          <div className="section-map">
            <LeafletMap
              loaded={this.store.profiles.length}
              controls={<AttributionControl prefix="lawis.at/profile" />}
              onViewportChanged={() => {}}
              mapConfigOverride={mapOptionsOverride}
              tileLayerConfigOverride={mapOptionsOverride}
              overlays={overlays}
            />
          </div>
        </section>
      </>
    );
  }
}
export default injectIntl(observer(SnowProfileMap));
