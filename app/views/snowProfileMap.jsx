import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import SnowProfileStore from "../stores/snowProfileStore";
import LeafletMap from "../components/leaflet/leaflet-map";
import ModalDialog from "../components/modal-dialog";
import StationMarker from "../components/leaflet/station-marker";
import { AttributionControl } from "react-leaflet";
import { modal_open_by_params } from "../js/modal";

class SnowProfileMap extends React.Component {
  constructor(props) {
    super(props);
    this.store = new SnowProfileStore();
    this.state = { profile: undefined };
  }

  componentDidMount() {
    this.store.load();
  }

  onProfileClick(profile) {
    this.setState({ profile });
    modal_open_by_params(
      null,
      "inline",
      "#snowProfileDialog",
      "snowProfileDialog",
      true
    );
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
          onClick={() => this.onProfileClick(profile)}
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
          <ModalDialog id="snowProfileDialog">
            <div className="modal-container">
              <div className="modal-weatherstation">
                <div className="modal-header">
                  <p className="caption">{this.state.profile?.$tooltip}</p>
                </div>
                <div className="modal-content">
                  <img
                    alt={this.state.profile?.$tooltip}
                    src={this.state.profile?.$img}
                    className="weatherstation-img"
                  />
                </div>
              </div>
            </div>
          </ModalDialog>
        </section>
      </>
    );
  }
}
export default injectIntl(observer(SnowProfileMap));
