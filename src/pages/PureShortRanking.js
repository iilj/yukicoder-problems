import React, { useState } from "react";
import { Ranking } from "../components/Ranking";
import * as CachedApiClient from "../utils/CachedApiClient";

export const PureShortRanking = () => {
  const [golferPureMap, setGolferPureMap] = useState({});
  CachedApiClient.cachedGolferPureMap()
    .then(map => setGolferPureMap(map));

  const ranking = Object.keys(golferPureMap).reduce((ar, userName) => {
    ar.push({ name: userName, count: golferPureMap[userName].length });
    return ar;
  }, []);

  return (
    <Ranking
      title={"Top Pure Golfers"}
      ranking={ranking}
    />
  );
}
