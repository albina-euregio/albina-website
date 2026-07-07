import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { $router, redirectPageQuery } from "../router";
import Modal from "../dialogs/albina-modal";
import { useIntl } from "../../i18n";
import { fetchText } from "../../util/fetch";
import { loadProfea } from "../../util/loadProfea";

export function useSnowProfileId() {
  const router = useStore($router);
  return [
    router?.search?.profile ?? "",
    (profile: string) => redirectPageQuery({ profile })
  ] as const;
}

interface Props {
  profileId: string;
  setProfileId: (id: string) => void;
}

function SnowProfileDetail({ profileId }: { profileId: string }) {
  const intl = useIntl();
  // Capture intl in a ref so the effect can resolve region names without
  // depending on it (useIntl returns a fresh object each render, which would
  // otherwise re-trigger the fetch on every render).
  const intlRef = useRef(intl);
  intlRef.current = intl;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    (async () => {
      try {
        const xml = await fetchText(
          `${config.apis.snowprofiles}/profiles/${encodeURIComponent(profileId)}`
        );
        const profea = await loadProfea();
        if (cancelled || !svgRef.current) return;

        const data = profea.parse(xml);

        // CAAML has no sub-region element; profea surfaces the raw micro-region
        // id (meta.subregionId, e.g. "AT-07-14-04"). Resolve it to a localised
        // name via the bundled eaws-regions catalog, as the rest of the app does.
        const subregionId = data.meta.subregionId;
        if (typeof subregionId === "string" && subregionId) {
          const name = intlRef.current.formatMessage({
            id: `region:${subregionId}`
          });
          if (name) data.meta.subregion = name;
        }

        profea.draw(data, svgRef.current, {
          colorizeByGrain: true
        });
      } catch (e) {
        console.error("Failed loading snow profile " + profileId, e);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return (
    <div className="snowprofile-detail">
      {loading && (
        <p>{intl.formatMessage({ id: "snowprofiles:detail:loading" })}</p>
      )}
      {error && (
        <p>{intl.formatMessage({ id: "snowprofiles:detail:error" })}</p>
      )}
      <svg ref={svgRef} style={{ display: "block" }} />
    </div>
  );
}

export function SnowProfileDetailsDialog(props: Props) {
  return (
    <Modal
      isOpen={!!props.profileId}
      onClose={() => props.setProfileId("")}
      width="fit-content"
    >
      {!!props.profileId && <SnowProfileDetail profileId={props.profileId} />}
    </Modal>
  );
}

export default SnowProfileDetailsDialog;
