import React, { useState } from "react";
import { Row } from "reactstrap";
import { useParams } from "react-router-dom";

import { DifficultyLevelTable } from "./DifficultyLevelTable"
import { ListTable } from "./ListTable";
import * as CachedApiClient from "../../utils/CachedApiClient";
import { DifficultyStarsFillDefs } from "../../components/DifficultyStars";

export const ListPage = props => {
  const { param, user } = useParams();

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const [contestMap, setContestMap] = useState({});
  const [problemContestMap, setProblemContestMap] = useState({});
  const [solvedProblemsMap, setSolvedProblemsMap] = useState({});

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
        <ListTable
          problems={problems}
          contestMap={contestMap}
          problemContestMap={problemContestMap}
          solvedProblemsMap={solvedProblemsMap}
        />
      </Row>
    </>
  );
};