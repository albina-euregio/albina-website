import React from "react";
import { observer } from "mobx-react";
import { injectIntl, IntlShape } from "react-intl";
import SnowProfileStore, { SnowProfile } from "../stores/snowProfileStore";
import LeafletMap from "../components/leaflet/leaflet-map";
import Modal from "../components/dialogs/albina-modal";
import StationMarker from "../components/leaflet/station-marker";
import HTMLHeader from "../components/organisms/html-header";
import { AttributionControl } from "react-leaflet";
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
          onClick={() => this.setState({ active: entry })}
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
          <Modal
            isOpen={!!this.state.active}
            onClose={() => this.setState({ active: undefined })}
          >
            {this.state.active && (
              <SnowProfileDialog active={this.state.active} />
            )}
          </Modal>
        </section>
      </>
    );
  }
}

export default injectIntl(observer(SnowProfileMap));

function SnowProfileDialog({
  active
}: {
  active: SnowProfile | Incident | undefined;
}) {
  return (
    <div className="modal-container">
      <div className="modal-weatherstation">
        <div className="modal-header">
          <p className="caption">
            {active?.location?.country?.text}
            {" – "}
            {active?.location?.region?.text}
            {" – "}
            {active?.location?.subregion?.text}
          </p>
          <h2 className="">
            <span className="weatherstation-name">{active?.$tooltip} </span>
            {active?.location?.elevation && (
              <span className="weatherstation-altitude">
                ({active?.location?.elevation}&thinsp;m){" "}
                {active?.location?.aspect?.text}
              </span>
            )}
          </h2>
        </div>
        <div className="modal-content">
          {active?.$img && (
            <img
              title={active?.$tooltip}
              alt={active?.$tooltip}
              src={active?.$img}
              className="weatherstation-img"
            />
          )}
          {active?.$url && (
            <button
              type="button"
              onClick={() => window.open(active?.$url)}
              title={active?.$tooltip}
              className="pure-button"
            >
              LAWIS.AT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
