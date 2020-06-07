import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row, FormGroup, Label, Input,
} from 'reactstrap';

import { YukicoderRegularTable } from './YukicoderRegularTable';
import { ContestTable } from './ContestTable';
import { AllProblemsTable } from './AllProblemsTable';
import { TableTabButtons, ContestTableTab } from './TableTab';
import { useLocalStorage } from '../../utils/LocalStorage';
import * as TypedCachedApiClient from '../../utils/TypedCachedApiClient';
import { DifficultyStarsFillDefs } from '../../components/DifficultyStars';
import { Contest, ContestId } from '../../interfaces/Contest';
import { Problem, ProblemId } from '../../interfaces/Problem';

/**
 * Wrap element to switch visibility.
 */
const ContestWrapper = (props: { display: boolean; children: React.ReactNode }) => (
  <div style={{ display: props.display ? '' : 'none' }}>{props.children}</div>
);

const initialUniversalState = {
  problems: [] as Problem[],
  contests: [] as Contest[],
  contestMap: new Map<ContestId, Contest>(),
  problemsMap: new Map<ProblemId, Problem>(),
  problemContestMap: new Map<ProblemId, ContestId>(),
};

const initialUserState = {
  solvedProblemsMap: new Map<ProblemId, Problem>(),
};

export const TablePage = () => {
  const { param, user } = useParams() as { param: TypedCachedApiClient.UserParam; user: string };

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const [problems, contests] = await Promise.all([
        TypedCachedApiClient.cachedProblemArray(),
        TypedCachedApiClient.cachedContestArray(),
      ]);
      const [problemsMap, contestMap, problemContestMap] = await Promise.all([
        TypedCachedApiClient.cachedProblemMap(),
        TypedCachedApiClient.cachedContestMap(),
        TypedCachedApiClient.cachedProblemContestMap(),
      ]);

      if (!unmounted) {
        setUniversalState({
          problems,
          contests,
          contestMap,
          problemsMap,
          problemContestMap,
        });
      }
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
      const solvedProblemsMap = param && user
        ? await TypedCachedApiClient.cachedSolvedProblemMap(param, user)
        : new Map<ProblemId, Problem>();

      if (!unmounted) {
        setUserState({
          solvedProblemsMap,
        });
      }
    };
    getUserInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [param, user, setUserState]);

  const {
    problems, contests, contestMap, problemsMap, problemContestMap,
  } = universalState;
  const { solvedProblemsMap } = userState;

  const [showDifficultyLevel, setShowDifficultyLevel] = useLocalStorage(
    'TablePage_showDifficultyLevel',
    true,
  );
  const [showContestResult, setShowContestResult] = useLocalStorage(
    'TablePage_showContestResult',
    true,
  );
  const [activeTab, setActiveTab] = useLocalStorage('TablePage_activeTab', ContestTableTab.regular);

  const yukicoderRegularContests = [] as Contest[];
  const yukicoderLongContests = [] as Contest[];
  const otherContests = [] as Contest[];
  contests.forEach((contest) => {
    if (contest.Name.match(/^yukicoder contest \d+/)) {
      if (contest.ProblemIdList.length <= 6) yukicoderRegularContests.push(contest);
      else yukicoderLongContests.push(contest);
    } else otherContests.push(contest);
  });

  return (
    <>
      <Row className="my-4">
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showDifficultyLevel}
              onChange={(e) => setShowDifficultyLevel(e.target.checked)}
            />
            Show Difficulty Level
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showContestResult}
              onChange={(e) => setShowContestResult(e.target.checked)}
            />
            Show Contest Result
          </Label>
        </FormGroup>
      </Row>
      <TableTabButtons active={activeTab} setActive={setActiveTab} />
      <DifficultyStarsFillDefs />
      <ContestWrapper display={activeTab === 0}>
        <YukicoderRegularTable
          contests={yukicoderRegularContests}
          title="yukicoder contest (regular)"
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === 1}>
        <ContestTable
          contests={yukicoderLongContests}
          title="yukicoder contest (long)"
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === 2}>
        <ContestTable
          contests={otherContests}
          title="Other contests"
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === 3}>
        <AllProblemsTable
          problems={problems}
          contestMap={contestMap}
          problemContestMap={problemContestMap}
          title="All Problems"
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
    </>
  );
};