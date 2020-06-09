import React, { useEffect, useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  Button,
  ButtonGroup,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { useParams } from 'react-router-dom';

import { DifficultyLevelTable } from './DifficultyLevelTable';
import { ProblemTypeTable } from './ProblemTypeTable';
import { ListTable, FilterState } from './ListTable';
import * as TypedCachedApiClient from '../../utils/TypedCachedApiClient';
import { WellPositionedDropdownMenu } from '../../components/WellPositionedDropdownMenu';
import { DifficultyStarsFillDefs, DifficultyStars } from '../../components/DifficultyStars';
import {
  DateRangePicker,
  INITIAL_FROM_DATE,
  INITIAL_TO_DATE,
} from '../../components/DateRangePicker';
import { ProblemTypeIconSpanWithName } from '../../components/ProblemTypeIcon';
import {
  Problem,
  ProblemNo,
  ProblemId,
  ProblemType,
  ProblemLevel,
  ProblemLevels,
} from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { Contest, ContestId } from '../../interfaces/Contest';
import { RankingProblem } from '../../interfaces/RankingProblem';

const INF_LEVEL = 100;

const initialUniversalState = {
  problems: [] as Problem[],
  contestMap: new Map<ContestId, Contest>(),
  problemContestMap: new Map<ProblemId, ContestId>(),
  golferProblemMap: new Map<ProblemNo, RankingProblem>(),
  golferPureProblemMap: new Map<ProblemNo, RankingProblem>(),
};

const initialUserState = {
  solvedProblems: [] as SolvedProblem[],
  solvedProblemsMap: new Map<ProblemId, SolvedProblem>(),
};

export const ListPage = () => {
  const { param, user } = useParams() as { param: TypedCachedApiClient.UserParam; user: string };

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const [problems, contestMap, golferProblemMap, golferPureProblemMap] = await Promise.all([
        TypedCachedApiClient.cachedProblemArray(),
        TypedCachedApiClient.cachedContestMap(),
        TypedCachedApiClient.cachedGolferRankingProblemMap(),
        TypedCachedApiClient.cachedGolferRankingPureProblemMap(),
      ]);
      const problemContestMap = await TypedCachedApiClient.cachedProblemContestMap();

      if (!unmounted) {
        setUniversalState({
          problems,
          contestMap,
          problemContestMap,
          golferProblemMap,
          golferPureProblemMap,
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
      const solvedProblems = param && user
        ? await TypedCachedApiClient.cachedSolvedProblemArray(param, user)
        : ([] as SolvedProblem[]);
      const solvedProblemsMap = param && user
        ? await TypedCachedApiClient.cachedSolvedProblemMap(param, user)
        : new Map<ProblemId, SolvedProblem>();

      if (!unmounted) {
        setUserState({
          solvedProblems,
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
    problems,
    contestMap,
    problemContestMap,
    golferProblemMap,
    golferPureProblemMap,
  } = universalState;
  const { solvedProblems, solvedProblemsMap } = userState;

  const [statusFilterState, setStatusFilterState] = useState<FilterState>('All');
  const [fromDifficultyLevel, setFromDifficultyLevel] = useState<ProblemLevel | -1>(-1);
  const [toDifficultyLevel, setToDifficultyLevel] = useState<ProblemLevel | 100>(INF_LEVEL);
  const [showTagsOfTryingProblems, setShowTagsOfTryingProblems] = useState(false);
  const [fromDate, setFromDate] = useState(INITIAL_FROM_DATE);
  const [toDate, setToDate] = useState(INITIAL_TO_DATE);
  const [problemTypeFilterState, setProblemTypeFilterState] = useState<ProblemType | 'All'>('All');

  return (
    <>
      <DifficultyStarsFillDefs />

      <Row className="my-2 border-bottom">
        <h1>Level Status</h1>
      </Row>
      <Row>
        <DifficultyLevelTable problems={problems} solvedProblems={solvedProblems} user={user} />
      </Row>

      <Row className="my-2 border-bottom">
        <h1>Type Status</h1>
      </Row>
      <Row>
        <ProblemTypeTable problems={problems} solvedProblems={solvedProblems} user={user} />
      </Row>

      <Row className="my-2 border-bottom">
        <h1>Problem List</h1>
      </Row>
      <Row>
        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>{statusFilterState}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setStatusFilterState('All')}>All</DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState('Only Trying')}>
                Only Trying
              </DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState('Only AC')}>Only AC</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>

        <ButtonGroup className="mr-4">
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {fromDifficultyLevel === -1 ? 'Level From' : `${fromDifficultyLevel} - `}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              {ProblemLevels.map((level) => (
                <DropdownItem key={level} onClick={() => setFromDifficultyLevel(level)}>
                  <DifficultyStars level={level} showDifficultyLevel />
                  {level.toFixed(1)}
                  {' '}
                  -
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledButtonDropdown>
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {toDifficultyLevel === INF_LEVEL ? 'Level To' : ` - ${toDifficultyLevel}`}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              {ProblemLevels.map((level) => (
                <DropdownItem key={level} onClick={() => setToDifficultyLevel(level)}>
                  <DifficultyStars level={level} showDifficultyLevel />
                  -
                  {level.toFixed(1)}
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledButtonDropdown>
        </ButtonGroup>

        <DateRangePicker
          minDate={INITIAL_FROM_DATE}
          maxDate={INITIAL_TO_DATE}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={(date: Date) => {
            setFromDate(date);
          }}
          onToDateChange={(date: Date) => {
            setToDate(date);
          }}
        />

        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>{problemTypeFilterState}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setProblemTypeFilterState('All')}>All</DropdownItem>
              <DropdownItem onClick={() => setProblemTypeFilterState(ProblemType.Normal)}>
                <ProblemTypeIconSpanWithName problemType={ProblemType.Normal} />
              </DropdownItem>
              <DropdownItem onClick={() => setProblemTypeFilterState(ProblemType.Educational)}>
                <ProblemTypeIconSpanWithName problemType={ProblemType.Educational} />
              </DropdownItem>
              <DropdownItem onClick={() => setProblemTypeFilterState(ProblemType.Scoring)}>
                <ProblemTypeIconSpanWithName problemType={ProblemType.Scoring} />
              </DropdownItem>
              <DropdownItem onClick={() => setProblemTypeFilterState(ProblemType.Joke)}>
                <ProblemTypeIconSpanWithName problemType={ProblemType.Joke} />
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>

        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showTagsOfTryingProblems}
              onChange={(e) => setShowTagsOfTryingProblems(e.target.checked)}
            />
            Show Tags of Trying Problems
          </Label>
        </FormGroup>

        <Button
          outline
          color="danger"
          onClick={() => {
            setStatusFilterState('All');
            setFromDifficultyLevel(-1);
            setToDifficultyLevel(INF_LEVEL);
            setShowTagsOfTryingProblems(false);
            setFromDate(INITIAL_FROM_DATE);
            setToDate(INITIAL_TO_DATE);
          }}
        >
          Reset
        </Button>
      </Row>
      <Row>
        <ListTable
          problems={problems}
          contestMap={contestMap}
          problemContestMap={problemContestMap}
          solvedProblemsMap={solvedProblemsMap}
          golferProblemMap={golferProblemMap}
          golferPureProblemMap={golferPureProblemMap}
          statusFilterState={statusFilterState}
          fromDifficultyLevel={fromDifficultyLevel}
          toDifficultyLevel={toDifficultyLevel}
          fromDate={fromDate === INITIAL_FROM_DATE ? undefined : fromDate}
          toDate={toDate === INITIAL_TO_DATE ? undefined : toDate}
          problemTypeFilterState={problemTypeFilterState}
          showTagsOfTryingProblems={showTagsOfTryingProblems}
        />
      </Row>
    </>
  );
};
