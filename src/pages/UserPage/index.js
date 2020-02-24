import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";

import * as CachedApiClient from "../../utils/CachedApiClient";
import { ordinalSuffixOf } from "../../utils";

export const UserPage = props => {
  const { param, user } = useParams();

  const [userInfo, setUserInfo] = useState({});
  const [golferMap, setGolferMap] = useState({});
  const [pureGolferMap, setPureGolferMap] = useState({});
  CachedApiClient.cachedGolferMap()
    .then(map => setGolferMap(map));
  CachedApiClient.cachedGolferPureMap()
    .then(map => setPureGolferMap(map));
  if (param && user)
    CachedApiClient.cachedUserInfo(param, user)
      .then(obj => setUserInfo(!obj.Message ? obj : {}));

  const name = userInfo ? userInfo.Name : undefined;

  const shortestCount = (name && name in golferMap) ? golferMap[name].length : 0;
  const golfRankerCount = Object.keys(golferMap).length;
  const shortestRank =
    (golfRankerCount === 0) ? 0
      : (shortestCount === 0) ? 1 + golfRankerCount
        : 1 + Object.keys(golferMap).reduce((cnt, userName) => {
          if (golferMap[userName].length > shortestCount) {
            ++cnt;
          }
          return cnt;
        }, 0);

  const pureShortestCount = (name && name in pureGolferMap) ? pureGolferMap[name].length : 0;
  const pureGolfRankerCount = Object.keys(pureGolferMap).length;
  const pureShortestRank =
    (pureGolfRankerCount === 0) ? 0
      : (pureShortestCount === 0) ? 1 + pureGolfRankerCount
        : 1 + Object.keys(pureGolferMap).reduce((cnt, userName) => {
          if (pureGolferMap[userName].length > pureShortestCount) {
            ++cnt;
          }
          return cnt;
        }, 0);

  const achievements = [
    {
      key: "Solved",
      value: userInfo.Solved ?? 0,
      rank: userInfo.Rank ?? 0
    },
    {
      key: "Shortest Code",
      value: shortestCount,
      rank: shortestRank
    },
    {
      key: "Pure Shortest Code",
      value: pureShortestCount,
      rank: pureShortestRank
    },
    {
      key: "Score",
      value: userInfo.Score ?? 0,
      rank: undefined
    },
    {
      key: "Points",
      value: userInfo.Points ?? 0,
      rank: undefined
    },
    {
      key: "Level",
      value: userInfo.Level ?? 0,
      rank: undefined
    },
    // {
    //   key: "Fastest Code",
    //   value: fastRank.count,
    //   rank: fastRank.rank
    // },
    // {
    //   key: "First AC",
    //   value: firstRank.count,
    //   rank: firstRank.rank
    // }
  ];

  return (
    <div>
      <Row className="my-2 border-bottom">
        <h1>{name}</h1>
      </Row>
      <Row className="my-3">
        {achievements.map(({ key, value, rank }) => (
          <Col key={key} className="text-center" xs="6" md="3">
            <h6>{key}</h6>
            <h3>{value}</h3>
            {rank === undefined ? null : <h6 className="text-muted">{`${rank}${ordinalSuffixOf(rank)}`}</h6>}
          </Col>
        ))}
      </Row>
    </div>
  );
};