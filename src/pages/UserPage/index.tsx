import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';
import dataFormat from 'dateformat';

import * as TypedCachedApiClient from '../../utils/TypedCachedApiClient';
import * as DifficultyDataClient from '../../utils/DifficultyDataClient';
import { ordinalSuffixOf } from '../../utils';

import { PieCharts } from './SmallPieChart';
import { ProblemLevelPieChart } from './ProblemLevelPieChart';
import { TabbedDailyEffortBarChart } from './TabbedDailyEffortBarChart';
import { TabbedClimbingLineChart } from './TabbedClimbingLineChart';
import { TabbedHeatmap } from './TabbedHeatmap';
import { SolvedProblemList } from './SolvedProblemList';
import {
  DifficultyStarsFillDefs,
  NormalStarElement,
} from '../../components/DifficultyStars';
import {
  DateRangePicker,
  INITIAL_FROM_DATE,
  INITIAL_TO_DATE,
} from '../../components/DateRangePicker';
import { Contest, ContestId } from '../../interfaces/Contest';
import { Problem, ProblemId, ProblemType } from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { User, UserName } from '../../interfaces/User';
import { RankingProblem } from '../../interfaces/RankingProblem';
import { ProblemLinkColorMode } from '../../components/ProblemLink';
import { useLocalStorage } from '../../utils/LocalStorage';
import { Difficulties } from '../../interfaces/Difficulty';

const MS_OF_HOUR = 1000 * 60 * 60;
const MS_OF_DAY = MS_OF_HOUR * 24;

const initialUniversalState = {
  golferMap: new Map<UserName, RankingProblem[]>(),
  pureGolferMap: new Map<UserName, RankingProblem[]>(),
  contests: [] as Contest[],
  contestMap: new Map<ContestId, Contest>(),
  problems: [] as Problem[],
  problemContestMap: new Map<ProblemId, ContestId>(),
  difficulties: {} as Difficulties,
};

const initialUserState = {
  userInfo: {} as User,
  solvedProblems: [] as SolvedProblem[],
  solvedProblemsMap: new Map<ProblemId, SolvedProblem>(),
  minDate: INITIAL_FROM_DATE,
  maxDate: INITIAL_TO_DATE,
};

export const UserPage: React.FC = () => {
  const { param, user } = useParams() as {
    param: TypedCachedApiClient.UserParam;
    user: string;
  };

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);
  const [userStateLoaded, setUserStateLoaded] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const [
        golferMap,
        pureGolferMap,
        problems,
        contests,
        difficulties,
      ] = await Promise.all([
        TypedCachedApiClient.cachedGolferMap(),
        TypedCachedApiClient.cachedGolferPureMap(),
        TypedCachedApiClient.cachedProblemArray(),
        TypedCachedApiClient.cachedContestArray(),
        DifficultyDataClient.cachedDifficultyData(),
      ]);
      const [contestMap, problemContestMap] = await Promise.all([
        TypedCachedApiClient.cachedContestMap(),
        TypedCachedApiClient.cachedProblemContestMap(),
      ]);

      if (!unmounted) {
        setUniversalState({
          golferMap,
          pureGolferMap,
          contests,
          contestMap,
          problems,
          problemContestMap,
          difficulties,
        });
        setUniversalStateLoaded(true);
      }
    };
    void getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);

  useEffect(() => {
    let unmounted = false;
    const getUserInfo = async () => {
      setUserStateLoaded(false);
      const [userInfo, solvedProblems] = await Promise.all([
        TypedCachedApiClient.cachedUserInfo(param, user),
        TypedCachedApiClient.cachedSolvedProblemArray(param, user),
      ]);
      const solvedProblemsMap = await TypedCachedApiClient.cachedSolvedProblemMap(
        param,
        user
      );

      const dates = solvedProblems.map((problem) => Date.parse(problem.Date));
      const minDate = new Date(Math.min.apply(null, dates));
      const maxDate = new Date(Math.max.apply(null, dates));
      minDate.setHours(0, 0, 0, 0);
      maxDate.setHours(23, 59, 59, 999);

      if (!unmounted) {
        setUserState({
          userInfo,
          solvedProblems,
          solvedProblemsMap,
          minDate,
          maxDate,
        });
        setUserStateLoaded(true);
      }
    };
    void getUserInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [param, user]);

  const {
    golferMap,
    pureGolferMap,
    contests,
    contestMap,
    problems,
    problemContestMap,
    difficulties,
  } = universalState;
  const {
    userInfo,
    solvedProblems,
    solvedProblemsMap,
    minDate,
    maxDate,
  } = userState;

  const [fromDate, setFromDate] = useState(INITIAL_FROM_DATE);
  const [toDate, setToDate] = useState(INITIAL_TO_DATE);

  const [colorMode, setColorMode] = useLocalStorage<ProblemLinkColorMode>(
    'TablePage_colorMode',
    'Level'
  );

  const name = userInfo ? userInfo.Name : undefined;

  // for user info section
  /** returns [shortestCount, shortestRank] */
  const countRank = (
    shortestMap: Map<UserName, RankingProblem[]>
  ): [number, number] => {
    const shortestCount =
      name && shortestMap.has(name)
        ? (shortestMap.get(name) as RankingProblem[]).length
        : 0;
    if (shortestMap.size === 0) return [shortestCount, 0];
    if (shortestCount === 0) return [shortestCount, 1 + shortestMap.size];
    let rank = 1;
    golferMap.forEach((rankingProblems) => {
      if (rankingProblems.length > shortestCount) {
        ++rank;
      }
    });
    return [shortestCount, rank];
  };
  const [shortestCount, shortestRank] = countRank(golferMap);
  const [pureShortestCount, pureShortestRank] = countRank(pureGolferMap);

  // for pichart
  const regexpContest = /^yukicoder contest \d+/;
  const regularContestProblemsCntMap = contests.reduce((map, contest) => {
    if (regexpContest.exec(contest.Name)) {
      return contest.ProblemIdList.reduce((map_, problemId, idx) => {
        const key = Math.min(idx, 5) as 0 | 1 | 2 | 3 | 4 | 5;
        if (!map_.has(key)) map_.set(key, { total: 0, solved: 0 });
        if (solvedProblemsMap.has(problemId))
          (map_.get(key) as { total: number; solved: number }).solved++;
        (map_.get(key) as { total: number; solved: number }).total++;
        return map_;
      }, map);
    }
    return map;
  }, new Map<0 | 1 | 2 | 3 | 4 | 5, { total: number; solved: number }>());
  const regularContestProblemsCnt = [] as { total: number; solved: number }[];
  regularContestProblemsCntMap.forEach((value, key) => {
    regularContestProblemsCnt[key] = value;
  });

  // for daily chart section
  const dailyCountMap = solvedProblems
    .map((solvedProblem) => solvedProblem.Date)
    .reduce((map, solveDate) => {
      const date = new Date(solveDate);
      date.setHours(0, 0, 0, 0);
      const key = Number(date); // sec - (sec % MS_OF_DAY);
      if (!map.has(key)) {
        map.set(key, 0);
      }
      return map.set(key, (map.get(key) ?? 0) + 1);
    }, new Map<number, number>());
  let dailyCount = [] as { dateSecond: number; count: number }[];
  dailyCountMap.forEach((value, key) => {
    dailyCount.push({ dateSecond: key, count: value });
  });
  dailyCount = dailyCount.sort((a, b) => a.dateSecond - b.dateSecond);

  const climbing = dailyCount.reduce((ar, { dateSecond, count }) => {
    const last = ar[ar.length - 1];
    ar.push({ dateSecond, count: last ? last.count + count : count });
    return ar;
  }, [] as { dateSecond: number; count: number }[]);

  const { longestStreak, currentStreak, prevDateSecond } = dailyCount
    .map((e) => e.dateSecond)
    .reduce(
      (state, dateSecond) => {
        const nextDateSecond = state.prevDateSecond + MS_OF_DAY;
        const currentStreak =
          dateSecond === nextDateSecond ? state.currentStreak + 1 : 1;
        const longestStreak = Math.max(state.longestStreak, currentStreak);
        return { longestStreak, currentStreak, prevDateSecond: dateSecond };
      },
      {
        longestStreak: 0,
        currentStreak: 0,
        prevDateSecond: 0,
      }
    );
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const isIncreasing = new Date(prevDateSecond) >= yesterdayDate;

  // for user level
  const userSolvedStars = solvedProblems
    .filter((solvedProblem) => solvedProblem.ProblemType === ProblemType.Normal)
    .map((solvedProblem) => solvedProblem.Level)
    .reduce((sum, cur) => sum + cur, 0 as number);
  const allProblemsStars = problems
    .filter((problem) => problem.ProblemType === ProblemType.Normal)
    .map((problem) => problem.Level)
    .reduce((sum, cur) => sum + cur, 0 as number);
  const origUserLevel =
    allProblemsStars > 0 ? (100.0 * userSolvedStars) / allProblemsStars : 0;
  const userLevel = Math.round(origUserLevel * 100) / 100;
  const nextLevel = Math.min(100, Math.floor(userLevel) + 1.0);
  const starsToAdvance = (allProblemsStars * (nextLevel - userLevel)) / 100;

  const achievements = [
    {
      key: 'Solved (Normal)',
      value: userInfo.Solved ?? 0,
      rank: userInfo.Rank ?? 0,
    },
    {
      key: 'Solved (All)',
      value: solvedProblems.length,
      rank: undefined,
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
        <h2>{name}</h2>
        {universalStateLoaded ? (
          <></>
        ) : (
          <Spinner
            style={{ width: '3rem', height: '3rem', marginLeft: '0.8rem' }}
          />
        )}
      </Row>
      {userStateLoaded ? (
        <></>
      ) : (
        <Spinner
          style={{
            width: '3rem',
            height: '3rem',
            position: 'fixed',
            right: '10px',
            bottom: '10px',
          }}
        />
      )}
      <DifficultyStarsFillDefs />

      <Row className="my-2 border-bottom">
        <h3>Scores</h3>
      </Row>
      <Row className="my-3">
        {achievements.map(({ key, value, rank }) => (
          <Col key={key} className="text-center col-achivement" xs="6" md="3">
            <h6>{key}</h6>
            <h4>{value}</h4>
            {rank === undefined ? null : (
              <h6 className="text-muted">
                {`${rank}${ordinalSuffixOf(rank)}`}
              </h6>
            )}
          </Col>
        ))}
        <Col key="Level" className="text-center" xs="6" md="3">
          <h6>Level</h6>
          <h4 title={`${userLevel} (${origUserLevel})`}>
            {userLevel.toFixed(2)}
          </h4>
          <h6
            className="text-muted"
            title={`${starsToAdvance} stars to level ${nextLevel}`}
          >
            <NormalStarElement /> *{Math.ceil(starsToAdvance * 2) / 2} to
            advance
          </h6>
        </Col>
      </Row>

      <Row className="my-2 border-bottom">
        <h3>Streaks</h3>
      </Row>
      <Row className="my-3">
        <Col key="Longest Streak" className="text-center" xs="6" md="3">
          <h6>Longest Streak</h6>
          <h4>{longestStreak} days</h4>
        </Col>
        <Col key="Current Streak" className="text-center" xs="6" md="3">
          <h6>Current Streak</h6>
          <h4>{isIncreasing ? currentStreak : 0} days</h4>
          <h6 className="text-muted">
            {`Last AC: ${
              prevDateSecond > 0 ? dataFormat(prevDateSecond, 'yyyy/mm/dd') : ''
            }`}
          </h6>
        </Col>
        <Col key="Streak Sum" className="text-center" xs="6" md="3">
          <h6>Streak Sum</h6>
          <h4>{dailyCount.length} days</h4>
        </Col>
      </Row>

      <PieCharts
        problems={regularContestProblemsCnt}
        title="yukicoder contest"
      />

      <Row className="my-2 border-bottom">
        <h2>Problem Level Pies</h2>
      </Row>
      <ProblemLevelPieChart
        problems={problems}
        solvedProblems={solvedProblems}
      />

      <Row className="my-2 border-bottom">
        <h2>Daily Effort</h2>
      </Row>
      <TabbedDailyEffortBarChart
        dailyData={dailyCount}
        solvedProblems={solvedProblems}
        syncId="DailyEffortChart"
      />

      <Row className="my-2 border-bottom">
        <h2>Climbing</h2>
      </Row>
      <TabbedClimbingLineChart
        climbingData={climbing}
        solvedProblems={solvedProblems}
        syncId="DailyEffortChart"
      />

      <Row className="my-2 border-bottom">
        <h2>Heatmap</h2>
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
        <h2>Solved Problems</h2>
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

        <UncontrolledDropdown>
          <DropdownToggle caret>
            {
              {
                None: 'Color By',
                Level: 'Level',
                Difficulty: 'Difficulty (experimental)',
              }[colorMode]
            }
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Color By</DropdownItem>
            <DropdownItem onClick={(): void => setColorMode('None')}>
              None
            </DropdownItem>
            <DropdownItem onClick={(): void => setColorMode('Level')}>
              Level
            </DropdownItem>
            <DropdownItem onClick={(): void => setColorMode('Difficulty')}>
              Difficulty (experimental)
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Row>
      <SolvedProblemList
        solvedProblems={solvedProblems}
        problemContestMap={problemContestMap}
        contestMap={contestMap}
        difficulties={difficulties}
        fromDate={fromDate}
        toDate={toDate}
        problemLinkColorMode={colorMode}
      />
    </div>
  );
};
