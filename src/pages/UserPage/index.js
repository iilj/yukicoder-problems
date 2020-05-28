import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import dataFormat from 'dateformat';

import * as CachedApiClient from '../../utils/CachedApiClient';
import { ordinalSuffixOf } from '../../utils';

import { PieCharts } from './SmallPieChart';
import { TabbedDailyEffortBarChart } from './TabbedDailyEffortBarChart';
import { TabbedClimbingLineChart } from './TabbedClimbingLineChart';
import { TabbedHeatmap } from './TabbedHeatmap';
import { SolvedProblemList } from './SolvedProblemList';
import { DifficultyStarsFillDefs, NormalStarElement } from '../../components/DifficultyStars';
import {
  DateRangePicker,
  INITIAL_FROM_DATE,
  INITIAL_TO_DATE,
} from '../../components/DateRangePicker';

const MS_OF_HOUR = 1000 * 60 * 60;
const MS_OF_DAY = MS_OF_HOUR * 24;

const initialUniversalState = {
  golferMap: {},
  pureGolferMap: {},
  contests: [],
  contestMap: {},
  problems: [],
  problemContestMap: {},
};

const initialUserState = {
  userInfo: {},
  solvedProblems: [],
  solvedProblemsMap: {},
  minDate: INITIAL_FROM_DATE,
  maxDate: INITIAL_TO_DATE,
};

export const UserPage = (props) => {
  let { param, user } = useParams();
  if (user) user = decodeURIComponent(user);

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const [golferMap, pureGolferMap, problems, contests] = await Promise.all([
        CachedApiClient.cachedGolferMap(),
        CachedApiClient.cachedGolferPureMap(),
        CachedApiClient.cachedProblemArray(),
        CachedApiClient.cachedContestArray(),
      ]);
      const [contestMap, problemContestMap] = await Promise.all([
        CachedApiClient.cachedContestMap(),
        CachedApiClient.cachedProblemContestMap(),
      ]);

      if (!unmounted)
        setUniversalState({
          golferMap,
          pureGolferMap,
          contests,
          contestMap,
          problems,
          problemContestMap,
        });
    };
    getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [setUniversalState]);

  useEffect(() => {
    let unmounted = false;
    const getUserInfo = async () => {
      let [userInfo, solvedProblems] = await Promise.all([
        CachedApiClient.cachedUserInfo(param, user).then((obj) => (!obj.Message ? obj : {})),
        CachedApiClient.cachedSolvedProblemArray(param, user),
      ]);
      const solvedProblemsMap = await CachedApiClient.cachedSolvedProblemMap(param, user);

      const dates = solvedProblems
        .filter((problem) => problem.Date != null)
        .map((problem) => Date.parse(problem.Date));
      const minDate = new Date(Math.min.apply(null, dates));
      const maxDate = new Date(Math.max.apply(null, dates));
      minDate.setHours(0, 0, 0, 0);
      maxDate.setHours(23, 59, 59, 999);

      if (!unmounted)
        setUserState({
          userInfo,
          solvedProblems,
          solvedProblemsMap,
          minDate,
          maxDate,
        });
    };
    getUserInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [param, user, setUserState]);

  const {
    golferMap,
    pureGolferMap,
    contests,
    contestMap,
    problems,
    problemContestMap,
  } = universalState;
  const { userInfo, solvedProblems, solvedProblemsMap, minDate, maxDate } = userState;

  const [fromDate, setFromDate] = useState(INITIAL_FROM_DATE);
  const [toDate, setToDate] = useState(INITIAL_TO_DATE);

  if (fromDate < minDate) {
    setFromDate(minDate);
  }
  if (toDate > maxDate) {
    setToDate(maxDate);
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
  const dailyCountMap = solvedProblems
    .map((solvedProblem) => solvedProblem.Date)
    .reduce((map, solveDate) => {
      const date = new Date(solveDate);
      date.setHours(0, 0, 0, 0);
      const key = Number(date); //sec - (sec % MS_OF_DAY);
      if (!(key in map)) {
        map[key] = 0;
      }
      map[key]++;
      return map;
    }, {});
  const dailyCount = Object.keys(dailyCountMap)
    .reduce((ar, key) => {
      ar.push({ dateSecond: Number(key), count: dailyCountMap[key] });
      return ar;
    }, [])
    .sort((a, b) => a.dateSecond - b.dateSecond);

  const climbing = dailyCount.reduce((ar, { dateSecond, count }) => {
    const last = ar[ar.length - 1];
    ar.push({ dateSecond, count: last ? last.count + count : count });
    return ar;
  }, []);

  const { longestStreak, currentStreak, prevDateSecond } = dailyCount
    .map((e) => e.dateSecond)
    .reduce(
      (state, dateSecond) => {
        const nextDateSecond = state.prevDateSecond + MS_OF_DAY;
        const currentStreak = dateSecond === nextDateSecond ? state.currentStreak + 1 : 1;
        const longestStreak = Math.max(state.longestStreak, currentStreak);
        return { longestStreak, currentStreak, prevDateSecond: dateSecond };
      },
      {
        longestStreak: 0,
        currentStreak: 0,
        prevDateSecond: 0,
      },
    );
  const currentDateSecond = Number(new Date());
  const yesterdaySecond = currentDateSecond - (currentDateSecond % MS_OF_DAY) - MS_OF_DAY;
  const isIncreasing = prevDateSecond >= yesterdaySecond;

  // for user level
  const userSolvedStars = solvedProblems
    .filter((solvedProblem) => solvedProblem.ProblemType === 0)
    .map((solvedProblem) => solvedProblem.Level)
    .reduce((sum, cur) => sum + cur, 0);
  const allProblemsStars = problems
    .filter((problem) => problem.ProblemType === 0)
    .map((problem) => problem.Level)
    .reduce((sum, cur) => sum + cur, 0);
  const origUserLevel = allProblemsStars > 0 ? (100.0 * userSolvedStars) / allProblemsStars : 0;
  const userLevel = Math.round(origUserLevel * 100) / 100;
  const nextLevel = Math.min(100, Math.floor(userLevel) + 1.0);
  const starsToAdvance = (allProblemsStars * (nextLevel - userLevel)) / 100;

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
    // {
    //   key: 'Level',
    //   value: userInfo.Level ?? 0,
    //   rank: undefined, // これは捨てて独自に計算する？
    // },
  ];

  return (
    <div>
      <Row className="my-2 border-bottom">
        <h1>{name}</h1>
      </Row>
      <DifficultyStarsFillDefs />
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
        <Col key="Level" className="text-center" xs="6" md="3">
          <h6>Level</h6>
          <h3 title={`${userLevel} (${origUserLevel})`}>{userLevel.toFixed(2)}</h3>
          <h6 className="text-muted" title={`${starsToAdvance} stars to level ${nextLevel}`}>
            <NormalStarElement /> * {Math.ceil(starsToAdvance * 2) / 2} to advance
          </h6>
        </Col>
        <Col key="Longest Streak" className="text-center" xs="6" md="3">
          <h6>Longest Streak</h6>
          <h3>{longestStreak} days</h3>
        </Col>
        <Col key="Current Streak" className="text-center" xs="6" md="3">
          <h6>Current Streak</h6>
          <h3>{isIncreasing ? currentStreak : 0} days</h3>
          <h6 className="text-muted">{`Last AC: ${
            prevDateSecond > 0 ? dataFormat(prevDateSecond, 'yyyy/mm/dd') : ''
          }`}</h6>
        </Col>
      </Row>

      <PieCharts problems={regularContestProblemsCnt} title="yukicoder contest" />

      <Row className="my-2 border-bottom">
        <h1>Daily Effort</h1>
      </Row>
      <TabbedDailyEffortBarChart dailyData={dailyCount} solvedProblems={solvedProblems} />

      <Row className="my-2 border-bottom">
        <h1>Climbing</h1>
      </Row>
      <TabbedClimbingLineChart climbingData={climbing} solvedProblems={solvedProblems} />

      <Row className="my-2 border-bottom">
        <h1>Heatmap</h1>
      </Row>
      <TabbedHeatmap
        dailyCountMap={dailyCountMap}
        solvedProblems={solvedProblems}
        onRectClick={(miliSec) => {
          setFromDate(new Date(new Date(miliSec).setHours(0, 0, 0, 0)));
          setToDate(new Date(new Date(miliSec).setHours(23, 59, 59, 999)));
        }}
      />

      <Row className="my-2 border-bottom">
        <h1>Solved Problems</h1>
      </Row>
      <Row>
        <DateRangePicker
          minDate={minDate}
          maxDate={maxDate}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={(date) => {
            setFromDate(date);
          }}
          onToDateChange={(date) => {
            setToDate(date);
          }}
        />
      </Row>
      <SolvedProblemList
        solvedProblems={solvedProblems}
        problemContestMap={problemContestMap}
        contestMap={contestMap}
        fromDate={fromDate}
        toDate={toDate}
      />
    </div>
  );
};
