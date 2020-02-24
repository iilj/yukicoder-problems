import React, { useState } from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  Button,
  ButtonGroup
} from "reactstrap";
import { useParams } from "react-router-dom";

import { DifficultyLevelTable } from "./DifficultyLevelTable"
import { ListTable } from "./ListTable";
import * as CachedApiClient from "../../utils/CachedApiClient";
import { DifficultyStarsFillDefs, DifficultyStars } from "../../components/DifficultyStars";

const INF_LEVEL = 100;

export const ListPage = props => {
  const { param, user } = useParams();

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const [contestMap, setContestMap] = useState({});
  const [problemContestMap, setProblemContestMap] = useState({});
  const [solvedProblemsMap, setSolvedProblemsMap] = useState({});

  const [statusFilterState, setStatusFilterState] = useState("All");
  const [fromDifficultyLevel, setFromDifficultyLevel] = useState(-1);
  const [toDifficultyLevel, setToDifficultyLevel] = useState(INF_LEVEL);

  CachedApiClient.cachedProblemArray()
    .then(ar => setProblems(ar));
  CachedApiClient.cachedContestMap()
    .then(map => setContestMap(map));
  CachedApiClient.cachedProblemContestMap()
    .then(map => setProblemContestMap(map));
  if (param && user) {
    CachedApiClient.cachedSolvedProblemArray(param, user)
      .then(ar => setSolvedProblems(ar));
    CachedApiClient.cachedSolvedProblemMap(param, user)
      .then(map => setSolvedProblemsMap(map));
  } else if (Object.keys(solvedProblemsMap).length > 0) {
    setSolvedProblemsMap({});
  }

  const difficultyLevels = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];

  return (
    <>
      <DifficultyStarsFillDefs />

      <Row className="my-2 border-bottom">
        <h1>Difficulty Level Status</h1>
      </Row>
      <Row>
        <DifficultyLevelTable
          problems={problems}
          solvedProblems={solvedProblems}
          user={user}
        />
      </Row>

      <Row className="my-2 border-bottom">
        <h1>Problem List</h1>
      </Row>
      <Row>
        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>{statusFilterState}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setStatusFilterState("All")}>
                All
              </DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState("Only Trying")}>
                Only Trying
              </DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState("Only AC")}>
                Only AC
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>

        <ButtonGroup className="mr-4">
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {fromDifficultyLevel === -1
                ? "Difficulty Level From"
                : `${fromDifficultyLevel} - `}
            </DropdownToggle>
            <DropdownMenu>
              {difficultyLevels.map(level => (
                <DropdownItem
                  key={level}
                  onClick={() => setFromDifficultyLevel(level)}
                >
                  <DifficultyStars level={level} showDifficultyLevel={true} />
                  {level} -
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {toDifficultyLevel === INF_LEVEL
                ? "Difficulty Level To"
                : ` - ${toDifficultyLevel}`}
            </DropdownToggle>
            <DropdownMenu>
              {difficultyLevels.map(level => (
                <DropdownItem
                  key={level}
                  onClick={() => setToDifficultyLevel(level)}
                >
                  <DifficultyStars level={level} showDifficultyLevel={true} />
                  - {level}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </ButtonGroup>
        <Button
          outline
          color="danger"
          onClick={() => {
            setStatusFilterState("All");
            setFromDifficultyLevel(-1);
            setToDifficultyLevel(INF_LEVEL);
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
          statusFilterState={statusFilterState}
          fromDifficultyLevel={fromDifficultyLevel}
          toDifficultyLevel={toDifficultyLevel}
        />
      </Row>
    </>
  );
};