import React, { useState, useEffect } from "react";
import $ from "jquery";
import ControlBar from "./control-bar.jsx";

const InfoBar = props => {
  const [currentLevel, setCurrentLevel] = useState("");
  let delayedLevel = "";
  let messageInterval;

  const levels = props.levels || {
    "": { message: "Loading", iconOn: true },
    loading: { message: "Loading", delay: 1000, iconOn: true },
    error: { message: "Error" },
    "ok:": { message: "finished", keep: true }
  };

  useEffect(() => {
    //console.log("BulletinMap->useEffect[props.regions] xx03");
    setInfoMessage();
    return resetInterval();
  }, []);

  useEffect(() => {
    //console.log("BulletinMap->useEffect[props.regions] xx03");
    setInfoMessage();
  });

  const getI = (def, para) => {
    // console.log("InfoBar->getI", typeof def, def, para);
    if (typeof def === "string") return def;
    if (typeof def === "object") return def[para];
    return undefined;
  };

  const resetInterval = () => {
    // console.log("InfoBar->resetInterval", messageInterval);
    if (messageInterval) {
      clearTimeout(messageInterval);
      messageInterval = undefined;
    }
  };

  const setInfoMessage = () => {
    //console.log("InfoBar->setInfoMessage", "state: " + currentLevel, "props: " + props.level, levels);//, getI(levels[props.level], "iconOn"))
    const newLevel = props.level;
    const newLevelData = levels[newLevel];
    let nDelay;
    if (!newLevelData) return;

    if (newLevel != currentLevel) {
      if ((nDelay = getI(newLevelData, "delay"))) {
        // console.log("InfoBar->setInfoMessage #1" , newLevel, delayedLevel);
        if (newLevel != delayedLevel) {
          //console.log("InfoBar->setInfoMessage #2" , currentLevel, newLevel, nDelay);
          resetInterval();
          messageInterval = setTimeout(() => {
            messageInterval = undefined;
            // console.log("InfoBar->TIMEOUT", newLevel,  currentLevel);
            if (newLevel != currentLevel) {
              setCurrentLevel(newLevel);
              delayedLevel = "";
            }
          }, nDelay);
          setLoadingIndicator(getI(newLevelData, "iconOn") || false);
          delayedLevel = newLevel;
        }
      } else {
        if (newLevel != currentLevel) {
          resetInterval();
          delayedLevel = "";
          if (!getI(newLevelData, "keep")) setCurrentLevel(newLevel);
          setLoadingIndicator(getI(newLevelData, "iconOn") || false);
        }
      }
    }
  };

  const setLoadingIndicator = on => {
    //show hide loading image
    //console.log("InfoBar->setLoadingIndicator", on)
    if (on) {
      $("html").addClass("page-loading");
      $("html").removeClass("page-loaded");
    } else {
      $("html").removeClass("page-loading");
      setTimeout(() => {
        $("html").addClass("page-loaded");
      }, 1000);
    }
  };

  let infoMessage = getI(levels[currentLevel], "message");
  if (Array.isArray(infoMessage) && infoMessage.length) {
    infoMessage = infoMessage[0];
  }
  if (infoMessage)
    return <ControlBar addClass="fade-in" l message={infoMessage} />;
  return [];
};

export default InfoBar;
