import React, { useState } from "react";
import { useEffect } from "react";

type Props = { loading: boolean };

function HTMLPageLoadingScreen({ loading }: Props) {
  useEffect(() => {
    if (loading) {
      document.body.classList.remove("page-loaded");
      document.body.classList.add("page-loading");
    } else {
      document.body.classList.add("page-loaded");
      document.body.classList.remove("page-loading");
    }
    return () => {
      document.body.classList.add("page-loaded");
      document.body.classList.remove("page-loading");
    };
  }, [loading]);
  return <></>;
}

export default HTMLPageLoadingScreen;

export function useSlowLoading(timeout = 5000) {
  const [loadingStart, setLoadingStart] = useState(Date.now());
  const [slowLoading, setSlowLoading] = useState(false);
  useEffect(() => {
    setSlowLoading(Date.now() - loadingStart > timeout);
    setTimeout(() => setSlowLoading(true), timeout);
  }, [loadingStart, setSlowLoading]);
  return [slowLoading, setLoadingStart];
}
