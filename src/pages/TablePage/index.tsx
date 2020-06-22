import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, FormGroup, Label, Input, Spinner } from 'reactstrap';

import { YukicoderRegularTable } from './YukicoderRegularTable';
import { ContestTable } from './ContestTable';
import { AllProblemsTable } from './AllProblemsTable';
import { TableTabButtons, ContestTableTab } from './TableTab';
import { useLocalStorage } from '../../utils/LocalStorage';
import * as TypedCachedApiClient from '../../utils/TypedCachedApiClient';
import { mergeSolveStatus, mergedProblemsToMap } from '../../utils/MergeProcs';
import { DifficultyStarsFillDefs } from '../../components/DifficultyStars';
import { Contest, ContestId } from '../../interfaces/Contest';
import { Problem, ProblemId } from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { MergedProblem } from '../../interfaces/MergedProblem';

/**
 * Wrap element to switch visibility.
 */
const ContestWrapper: React.FC<{
  display: boolean;
}> = (props) => <>{props.display ? props.children : <></>}</>;

const initialUniversalState = {
  problems: [] as Problem[],
  contests: [] as Contest[],
  contestMap: new Map<ContestId, Contest>(),
  problemContestMap: new Map<ProblemId, ContestId>(),
};

const initialUserState = {
  solvedProblemsMap: new Map<ProblemId, SolvedProblem>(),
};

const initialMergedState = {
  mergedProblemsMap: new Map<ProblemId, MergedProblem>(),
};

export const TablePage: React.FC = () => {
  const { param, user } = useParams() as {
    param: TypedCachedApiClient.UserParam;
    user: string;
  };

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);
  const [mergedState, setMergedState] = useState(initialMergedState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);
  const [userStateLoaded, setUserStateLoaded] = useState(false);
  const [mergedStateLoaded, setMergedStateLoaded] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const [problems, contests] = await Promise.all([
        TypedCachedApiClient.cachedProblemArray(),
        TypedCachedApiClient.cachedContestArray(),
      ]);
      const [contestMap, problemContestMap] = await Promise.all([
        TypedCachedApiClient.cachedContestMap(),
        TypedCachedApiClient.cachedProblemContestMap(),
      ]);

      if (!unmounted) {
        setUniversalState({
          problems,
          contests,
          contestMap,
          problemContestMap,
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
      const solvedProblemsMap =
        param && user
          ? await TypedCachedApiClient.cachedSolvedProblemMap(param, user)
          : new Map<ProblemId, SolvedProblem>();

      if (!unmounted) {
        setUserState({
          solvedProblemsMap,
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

  useEffect(() => {
    let unmounted = false;
    const getMergedInfo = () => {
      setMergedStateLoaded(false);
      const mergedProblems = mergeSolveStatus(
        universalState.problems,
        universalState.contests,
        universalState.problemContestMap,
        userState.solvedProblemsMap
      );
      const mergedProblemsMap = mergedProblemsToMap(mergedProblems);

      if (!unmounted) {
        setMergedState({
          mergedProblemsMap,
        });
        setMergedStateLoaded(true);
      }
    };
    void getMergedInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [universalState, userState]);

  const { problems, contests, contestMap, problemContestMap } = universalState;
  const { solvedProblemsMap } = userState;
  const { mergedProblemsMap } = mergedState;

  const [showDifficultyLevel, setShowDifficultyLevel] = useLocalStorage(
    'TablePage_showDifficultyLevel',
    true
  );
  const [showContestResult, setShowContestResult] = useLocalStorage(
    'TablePage_showContestResult',
    true
  );
  const [activeTab, setActiveTab] = useLocalStorage(
    'TablePage_activeTab',
    ContestTableTab.regular
  );

  const yukicoderRegularContests = [] as Contest[];
  const yukicoderLongContests = [] as Contest[];
  const otherContests = [] as Contest[];
  const regexpContest = /^yukicoder contest \d+/;
  contests.forEach((contest) => {
    if (regexpContest.exec(contest.Name)) {
      if (contest.ProblemIdList.length <= 6)
        yukicoderRegularContests.push(contest);
      else yukicoderLongContests.push(contest);
    } else otherContests.push(contest);
  });

  return (
    <>
      {userStateLoaded && mergedStateLoaded ? (
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
      <ContestWrapper display={activeTab === ContestTableTab.regular}>
        <YukicoderRegularTable
          contests={yukicoderRegularContests}
          title="yukicoder contest (regular)"
          mergedProblemsMap={mergedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === ContestTableTab.long}>
        <ContestTable
          contests={yukicoderLongContests}
          title="yukicoder contest (long)"
          mergedProblemsMap={mergedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === ContestTableTab.other}>
        <ContestTable
          contests={otherContests}
          title="Other contests"
          mergedProblemsMap={mergedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === ContestTableTab.all}>
        <AllProblemsTable
          problems={problems}
          contestMap={contestMap}
          problemContestMap={problemContestMap}
          title="All Problems"
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
    </>
  );
};
