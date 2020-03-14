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
import { ListTable } from './ListTable';
import * as CachedApiClient from '../../utils/CachedApiClient';
import { WellPositionedDropdownMenu } from '../../components/WellPositionedDropdownMenu';
import { DifficultyStarsFillDefs, DifficultyStars } from '../../components/DifficultyStars';

const INF_LEVEL = 100;

const initialUniversalState = {
  problems: [],
  contestMap: {},
  problemContestMap: {},
  golferProblemMap: {},
  golferPureProblemMap: {},
};

const initialUserState = {
  solvedProblems: [],
  solvedProblemsMap: {},
};

export const ListPage = (props) => {
  let { param, user } = useParams();
  user = decodeURIComponent(user);

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const [problems, contestMap, golferProblemMap, golferPureProblemMap] = await Promise.all([
        CachedApiClient.cachedProblemArray(),
        CachedApiClient.cachedContestMap(),
        CachedApiClient.cachedGolferRankingProblemMap(),
        CachedApiClient.cachedGolferRankingPureProblemMap(),
      ]);
      const problemContestMap = await CachedApiClient.cachedProblemContestMap();

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
      if (param && user) {
        const solvedProblems = await CachedApiClient.cachedSolvedProblemArray(param, user);
        const solvedProblemsMap = await CachedApiClient.cachedSolvedProblemMap(param, user);

        if (!unmounted) {
          setUserState({
            solvedProblems,
            solvedProblemsMap,
          });
        }
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

  const [statusFilterState, setStatusFilterState] = useState('All');
  const [fromDifficultyLevel, setFromDifficultyLevel] = useState(-1);
  const [toDifficultyLevel, setToDifficultyLevel] = useState(INF_LEVEL);
  const [showTagsOfTryingProblems, setShowTagsOfTryingProblems] = useState(false);

  const difficultyLevels = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];

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
              {difficultyLevels.map((level) => (
                <DropdownItem key={level} onClick={() => setFromDifficultyLevel(level)}>
                  <DifficultyStars level={level} showDifficultyLevel />
                  {level}
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
              {difficultyLevels.map((level) => (
                <DropdownItem key={level} onClick={() => setToDifficultyLevel(level)}>
                  <DifficultyStars level={level} showDifficultyLevel />
                  -
                  {level}
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledButtonDropdown>
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
          showTagsOfTryingProblems={showTagsOfTryingProblems}
        />
      </Row>
    </>
  );
};
