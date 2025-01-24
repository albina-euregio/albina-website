import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WeatherStationDialog from "../components/dialogs/weather-station-dialog";
import HTMLHeader from "../components/organisms/html-header";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import FeatureInfo from "../components/weather/feature-info";
import WeatherMap from "../components/weather/weather-map";
import WeatherMapCockpit from "../components/weather/weather-map-cockpit";
import { useIntl } from "../i18n";
import Player from "../js/player";
import * as store from "../stores/weatherMapStore";

const Weather = () => {
  const intl = useIntl();
  const params = useParams();
  const [stationId, setStationId] = useState("");

  const [headerText] = useState("");

  const [playing, setPlaying] = useState(false);

  const domainId = useStore(store.domainId);
  const stations = useStore(store.stations);
  const selectedFeature = useStore(store.selectedFeature);

  const [player] = useState(() => {
    //console.log("player->new Player s05");
    return Player({
      transitionTime: 1000,
      onTick: () => {
        //console.log("player->onTick s05");
        store.changeCurrentTime(store.nextTime);
      },
      onStop: () => {
        setPlaying(false);
      },
      onStart: () => {
        setPlaying(true);
      }
    });
  });

  useEffect(() => {
    const footer = document.getElementById("page-footer");
    if (!footer) return;
    footer.style.display = "none";
    return () => {
      footer.style.display = "";
    };
  }, []);

  useEffect(() => {
    //console.log("weather->useeffect[params.domain]", {params});
    store.changeDomain(params.domain);
  }, [params.domain]);

  return (
    <>
      <WeatherStationDialog
        stationData={stations ?? []}
        stationId={stationId}
        setStationId={setStationId}
      />
      <HTMLHeader title={intl.formatMessage({ id: "weathermap:title" })} />
      <PageHeadline
        title={intl.formatMessage({ id: "weathermap:headline" })}
        marginal={headerText}
      />

      <section
        id="section-weather-map"
        className="section section-weather-map section-weather-map-cockpit"
      >
        {domainId && (
          <div className="section-map">
            <WeatherMap
              playerCB={player.onLayerEvent}
              isPlaying={playing}
              onMarkerSelected={feature => setStationId(feature?.id)}
              onViewportChanged={() => {}}
            />
            {selectedFeature && <FeatureInfo feature={selectedFeature} />}
            <WeatherMapCockpit key="cockpit" />
          </div>
        )}
      </section>
      <SmShare />
    </>
  );
};
export default Weather;
