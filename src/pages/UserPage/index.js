import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import * as CachedApiClient from '../../utils/CachedApiClient';
import { ordinalSuffixOf } from '../../utils';

import { PieCharts } from './SmallPieChart';
import { DailyEffortBarChart } from './DailyEffortBarChart';
import { ClimbingLineChart } from './ClimbingLineChart';
import { CalendarHeatmap } from './CalendarHeatmap';
import { SolvedProblemList } from './SolvedProblemList';
import dataFormat from 'dateformat';

export const UserPage = (props) => {
  const { param, user } = useParams();

  const [userInfo, setUserInfo] = useState({});
  const [golferMap, setGolferMap] = useState({});
  const [pureGolferMap, setPureGolferMap] = useState({});

  const [contests, setContests] = useState([]);
  const [contestMap, setContestMap] = useState({});
  const [problemContestMap, setProblemContestMap] = useState({});
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [solvedProblemsMap, setSolvedProblemsMap] = useState({});

  CachedApiClient.cachedGolferMap().then((map) => setGolferMap(map));
  CachedApiClient.cachedGolferPureMap().then((map) => setPureGolferMap(map));

  CachedApiClient.cachedContestArray().then((ar) => setContests(ar));
  CachedApiClient.cachedContestMap().then((map) => setContestMap(map));
  CachedApiClient.cachedProblemContestMap().then((map) => setProblemContestMap(map));

  if (param && user) {
    CachedApiClient.cachedSolvedProblemArray(param, user).then((ar) => setSolvedProblems(ar));
    CachedApiClient.cachedSolvedProblemMap(param, user).then((map) => setSolvedProblemsMap(map));
    CachedApiClient.cachedUserInfo(param, user).then((obj) => setUserInfo(!obj.Message ? obj : {}));
  }

  const name = userInfo ? userInfo.Name : undefined;

  // for user info section
  const shortestCount = name && name in golferMap ? golferMap[name].length : 0;
  const golfRankerCount = Object.keys(golferMap).length;
  const shortestRank =
    golfRankerCount === 0
      ? 0
      : shortestCount === 0
      ? 1 + golfRankerCount
      : 1 +
        Object.keys(golferMap).reduce((cnt, userName) => {
          if (golferMap[userName].length > shortestCount) {
            ++cnt;
          }
          return cnt;
        }, 0);

  const pureShortestCount = name && name in pureGolferMap ? pureGolferMap[name].length : 0;
  const pureGolfRankerCount = Object.keys(pureGolferMap).length;
  const pureShortestRank =
    pureGolfRankerCount === 0
      ? 0
      : pureShortestCount === 0
      ? 1 + pureGolfRankerCount
      : 1 +
        Object.keys(pureGolferMap).reduce((cnt, userName) => {
          if (pureGolferMap[userName].length > pureShortestCount) {
            ++cnt;
          }
          return cnt;
        }, 0);

  // for pichart
  const regularContestProblemsCntMap = contests.reduce((map, contest) => {
    if (contest.Name.match(/^yukicoder contest \d+/))
      return contest.ProblemIdList.reduce((map_, problemId, idx) => {
        const key = Math.min(idx, 5);
        if (!(key in map_)) map_[key] = { total: 0, solved: 0 };
        if (problemId in solvedProblemsMap) map_[key].solved++;
        map_[key].total++;
        return map_;
      }, map);
    else return map;
  }, {});
  const regularContestProblemsCnt = Object.keys(regularContestProblemsCntMap).reduce((ar, key) => {
    ar[key] = regularContestProblemsCntMap[key];
    return ar;
  }, []);

  // for daily chart section
  const MS_OF_HOUR = 1000 * 60 * 60;
  const dailyCountMap = solvedProblems
    .map((solvedProblem) => Date.parse(solvedProblem.Date) + MS_OF_HOUR * 9)
    .reduce((map, sec) => {
      const key = sec - (sec % (MS_OF_HOUR * 24));
      if (!(key in map)) {
        map[key] = 0;
      }
      map[key]++;
      return map;
    }, {});
  const dailyCount = Object.keys(dailyCountMap)
    .reduce((ar, key) => {
      ar.push({ dateSecond: key, count: dailyCountMap[key] });
      return ar;
    }, [])
    .sort((a, b) => a.dateSecond - b.dateSecond);

  const climbing = dailyCount.reduce((ar, { dateSecond, count }) => {
    const last = ar[ar.length - 1];
    ar.push({ dateSecond, count: last ? last.count + count : count });
    return ar;
  }, []);

  const achievements = [
    {
      key: 'Solved',
      value: userInfo.Solved ?? 0,
      rank: userInfo.Rank ?? 0,
    },
    {
      key: 'Shortest Code',
      value: shortestCount,
      rank: shortestRank,
    },
    {
      key: 'Pure Shortest Code',
      value: pureShortestCount,
      rank: pureShortestRank,
    },
    {
      key: 'Score',
      value: userInfo.Score ?? 0,
      rank: undefined,
    },
    {
      key: 'Points',
      value: userInfo.Points ?? 0,
      rank: undefined,
    },
    {
      key: 'Level',
      value: userInfo.Level ?? 0,
      rank: undefined,
    },
  ];

  return (
    <div>
      <Row className="my-2 border-bottom">
        <h1>{name}</h1>
      </Row>
      <Row className="my-3">
        {achievements.map(({ key, value, rank }) => (
          <Col key={key} className="text-center col-achivement" xs="6" md="3">
            <h6>{key}</h6>
            <h3>{value}</h3>
            {rank === undefined ? null : (
              <h6 className="text-muted">{`${rank}${ordinalSuffixOf(rank)}`}</h6>
            )}
          </Col>
        ))}
      </Row>

      <PieCharts problems={regularContestProblemsCnt} title="yukicoder contest" />

      <Row className="my-2 border-bottom">
        <h1>Daily Effort</h1>
      </Row>
      <DailyEffortBarChart dailyData={dailyCount} />

      <Row className="my-2 border-bottom">
        <h1>Climbing</h1>
      </Row>
      <ClimbingLineChart climbingData={climbing} />

      <Row className="my-2 border-bottom">
        <h1>Heatmap</h1>
      </Row>
      <Row className="my-5">
        <CalendarHeatmap
          dailyCountMap={dailyCountMap}
          formatTooltip={(date, count) =>
            `${dataFormat(new Date(date), 'yyyy/mm/dd')} ${count} submissions`
          }
        />
      </Row>

      <Row className="my-2 border-bottom">
        <h1>Solved Problems</h1>
      </Row>
      <SolvedProblemList
        solvedProblems={solvedProblems}
        problemContestMap={problemContestMap}
        contestMap={contestMap}
      />
    </div>
  );
};
