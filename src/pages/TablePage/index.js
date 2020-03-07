import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { YukicoderRegularTable } from "./YukicoderRegularTable"
import { ContestTable } from "./ContestTable"
import { TableTabButtons } from "./TableTab"
import * as CachedApiClient from "../../utils/CachedApiClient";
import { DifficultyStarsFillDefs } from "../../components/DifficultyStars";

const ContestWrapper = props => {
  return (
    <div style={{ display: props.display ? "" : "none" }}>{props.children}</div>
  );
};

export const TablePage = props => {
  const { param, user } = useParams();

  const [showDifficultyLevel, setShowDifficultyLevel] = useState(true);
  const [showContestResult, setShowContestResult] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [contests, setContests] = useState([]);
  const [problemsMap, setProblemsMap] = useState({});
  const [solvedProblemsMap, setSolvedProblemsMap] = useState({});

  CachedApiClient.cachedContestArray()
    .then(ar => setContests(ar));
  CachedApiClient.cachedProblemMap()
    .then(map => setProblemsMap(map));
  if (param && user)
    CachedApiClient.cachedSolvedProblemMap(param, user)
      .then(map => setSolvedProblemsMap(map));
  else if (Object.keys(solvedProblemsMap).length > 0)
    setSolvedProblemsMap({});

  let yukicoderRegularContests = [];
  let yukicoderLongContests = [];
  let otherContests = [];
  contests.forEach(contest => {
    if (contest.Name.match(/^yukicoder contest \d+/))
      if (contest.ProblemIdList.length <= 6)
        yukicoderRegularContests.push(contest);
      else
        yukicoderLongContests.push(contest);
    else
      otherContests.push(contest);
  });

  return (
    <>
      <Row className="my-4">
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showDifficultyLevel}
              onChange={e => setShowDifficultyLevel(e.target.checked)}
            />
            Show Difficulty Level
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showContestResult}
              onChange={e => setShowContestResult(e.target.checked)}
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
          title={"yukicoder contest (regular)"}
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult} />
      </ContestWrapper>
      <ContestWrapper display={activeTab === 1}>
        <ContestTable
          contests={yukicoderLongContests}
          title={"yukicoder contest (long)"}
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult} />
      </ContestWrapper>
      <ContestWrapper display={activeTab === 2}>
        <ContestTable
          contests={otherContests}
          title={"Other contests"}
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult} />
      </ContestWrapper>
    </>
  );
};