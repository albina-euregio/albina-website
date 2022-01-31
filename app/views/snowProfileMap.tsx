import React from "react";
import { observer } from "mobx-react";
import { injectIntl, IntlShape } from "react-intl";
import SnowProfileStore, { SnowProfile } from "../stores/snowProfileStore";
import LeafletMap from "../components/leaflet/leaflet-map";
import ModalDialog from "../components/modal-dialog";
import StationMarker from "../components/leaflet/station-marker";
import HTMLHeader from "../components/organisms/html-header";
import { AttributionControl } from "react-leaflet";
import { modal_open_by_params } from "../js/modal";
import IncidentStore, { Incident } from "../stores/incidentStore";

class SnowProfileMap extends React.Component<{ intl: IntlShape }> {
  snowProfileStore = new SnowProfileStore();
  incidentStore = new IncidentStore();
  state = { active: undefined as SnowProfile | Incident | undefined };

  get isIncident(): boolean {
    return /incident/.test(location.pathname);
  }

  componentDidMount() {
    this.isIncident ? this.incidentStore.load() : this.snowProfileStore.load();
  }

  onMarkerClick(active: SnowProfile | Incident) {
    this.setState({ active });
    modal_open_by_params(
      null,
      "inline",
      "#snowProfileDialog",
      "snowProfileDialog"
    );
  }

  get title(): string {
    return this.isIncident
      ? this.props.intl.formatMessage({ id: "menu:lawis:incident" })
      : this.props.intl.formatMessage({ id: "menu:lawis:profile" });
  }

  get attribution(): string {
    return this.isIncident
      ? `<a href="https://lawis.at/incident/" rel="noopener noreferrer" target="_blank">lawis.at/incident</a>`
      : `<a href="https://lawis.at/profile/" rel="noopener noreferrer" target="_blank">lawis.at/profile</a>`;
  }

  get entries(): (SnowProfile | Incident)[] {
    return this.isIncident
      ? this.incidentStore.incidents
      : this.snowProfileStore.profiles;
  }

  render() {
    const overlays = this.entries.map(entry => {
      return (
        <StationMarker
          className="tooltip"
          color={entry.$color}
          coordinates={entry.$latlng}
          iconAnchor={[12.5, 12.5]}
          itemId="any"
          key={`profile-${entry.id}`}
          onClick={() => this.onMarkerClick(entry)}
          tooltip={entry.$tooltip}
        />
      );
    });
    return (
      <>
        <HTMLHeader title={this.title} />
        <section
          id="section-weather-map"
          className="section section-weather-map"
        >
          <div className="section-map">
            <LeafletMap
              loaded={this.entries.length > 0}
              controls={<AttributionControl prefix={this.attribution} />}
              gestureHandling={false}
              mapConfigOverride={{ maxZoom: 12 }}
              tileLayerConfigOverride={{ maxZoom: 12 }}
              onViewportChanged={() => {}}
              overlays={overlays}
            />
          </div>
          <ModalDialog id="snowProfileDialog">
            <div className="modal-container">
              <div className="modal-weatherstation">
                <div className="modal-header">
                  <p className="caption">
                    {this.state.active?.location?.country?.text}
                    {" – "}
                    {this.state.active?.location?.region?.text}
                    {" – "}
                    {this.state.active?.location?.subregion?.text}
                  </p>
                  <h2 className="">
                    <span className="weatherstation-name">
                      {this.state.active?.$tooltip}{" "}
                    </span>
                    {this.state.active?.location?.elevation && (
                      <span className="weatherstation-altitude">
                        ({this.state.active?.location?.elevation}&thinsp;m){" "}
                        {this.state.active?.location?.aspect?.text}
                      </span>
                    )}
                  </h2>
                </div>
                <div className="modal-content">
                  {this.state.active?.$img && (
                    <img
                      title={this.state.active?.$tooltip}
                      alt={this.state.active?.$tooltip}
                      src={this.state.active?.$img}
                      className="weatherstation-img"
                    />
                  )}
                  {this.state.active?.$url && (
                    <button
                      type="button"
                      onClick={() => window.open(this.state.active?.$url)}
                      title={this.state.active?.$tooltip}
                      className="pure-button"
                    >
                      LAWIS.AT
                    </button>
                  )}
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
