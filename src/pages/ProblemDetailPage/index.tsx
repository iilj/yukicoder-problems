import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
  UncontrolledDropdown,
} from 'reactstrap';
import dataFormat from 'dateformat';
import {
  ProblemLink,
  ProblemLinkColorMode,
} from '../../components/ProblemLink';
import { Problem, ProblemId, ProblemNo } from '../../interfaces/Problem';
import { useLocalStorage } from '../../utils/LocalStorage';
import * as TypedCachedApiClient from '../../utils/TypedCachedApiClient';
import * as DifficultyDataClient from '../../utils/DifficultyDataClient';
import { DifficultyStars } from '../../components/DifficultyStars';
import { SubmissionLink } from '../../components/SubmissionLink';
import { Contest, ContestId } from '../../interfaces/Contest';
import { RankingProblem } from '../../interfaces/RankingProblem';
import { ContestLink } from '../../components/ContestLink';
import { ProblemTypeIconSpanWithName } from '../../components/ProblemTypeIcon';
import { TabbedDifficultyChart } from './TabbedDifficultyChart';
import { useResetScroll } from '../../utils/UseResetScroll';
import { getHeader } from '../../utils';

const initialUniversalState = {
  problem: {} as Problem,
  contestMap: new Map<ContestId, Contest>(),
  problemContestMap: new Map<ProblemId, ContestId>(),
  golferProblemMap: new Map<ProblemNo, RankingProblem>(),
  golferPureProblemMap: new Map<ProblemNo, RankingProblem>(),
  difficultyDetailData: DifficultyDataClient.difficultyDetailDataUnit,
};

export const ProblemDetailPage: React.FC = () => {
  const { problemIdString } = useParams() as {
    problemIdString: string;
  };
  const problemId = Number(problemIdString);

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);

  useResetScroll();
  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const [
        problem,
        contestMap,
        problemContestMap,
        golferProblemMap,
        golferPureProblemMap,
        difficultyDetailData,
      ] = await Promise.all([
        TypedCachedApiClient.cachedSingleProblem(problemId),
        TypedCachedApiClient.cachedContestMap(),
        TypedCachedApiClient.cachedProblemContestMap(),
        TypedCachedApiClient.cachedGolferRankingProblemMap(),
        TypedCachedApiClient.cachedGolferRankingPureProblemMap(),
        DifficultyDataClient.cachedDifficultyDetailData(problemId),
      ]);

      if (!unmounted) {
        setUniversalState({
          problem,
          contestMap,
          problemContestMap,
          golferProblemMap,
          golferPureProblemMap,
          difficultyDetailData,
        });
        setUniversalStateLoaded(true);
      }
    };
    void getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [problemId]);

  const {
    problem,
    contestMap,
    problemContestMap,
    golferProblemMap,
    golferPureProblemMap,
    difficultyDetailData,
  } = universalState;

  const contestId = problemContestMap.get(problemId);
  const contest = contestId ? contestMap.get(contestId) : undefined;
  const header = contest
    ? `${getHeader(
        contest.ProblemIdList.findIndex((pid) => pid === problem.ProblemId)
      )}. `
    : '';

  const shortestRankingProblem = golferProblemMap.get(problemId);
  const pureShortestRankingProblem = golferPureProblemMap.get(problemId);

  const [colorMode, setColorMode] = useLocalStorage<ProblemLinkColorMode>(
    'TablePage_colorMode',
    'Level'
  );

  return (
    <>
      <Row className="my-2 border-bottom">
        {universalStateLoaded ? (
          <h2>{problem.Title}</h2>
        ) : (
          <Spinner
            style={{ width: '3rem', height: '3rem', marginLeft: '0.8rem' }}
          />
        )}
      </Row>

      <Row className="my-2 border-bottom">
        <h3>Solve Probability Chart</h3>
      </Row>
      <TabbedDifficultyChart difficultyDetailData={difficultyDetailData} />

      <Row className="my-2 border-bottom">
        <h3>Info</h3>
      </Row>
      <Row className="my-4">
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
      <Row className="my-3">
        <Table striped bordered hover responsive>
          <tbody>
            <tr key="problem-title">
              <th>Title</th>
              <td>
                <ProblemLink
                  problemTitle={`${header}${problem.Title}`}
                  problemNo={problem.No as ProblemNo}
                  level={problem.Level}
                  problemLinkColorMode={colorMode}
                  difficulty={difficultyDetailData.difficulty}
                  augmented={difficultyDetailData.augmented}
                />
              </td>
            </tr>
            <tr key="problem-date">
              <th>Date</th>
              <td>
                {problem.Date
                  ? dataFormat(new Date(problem.Date), 'yyyy/mm/dd HH:MM')
                  : '-'}
              </td>
            </tr>
            <tr key="problem-level">
              <th>Level</th>
              <td>
                <DifficultyStars
                  level={problem.Level}
                  showDifficultyLevel={true}
                  color={colorMode === 'Level'}
                />
              </td>
            </tr>
            <tr key="problem-contest">
              <th>Contest</th>
              <td>
                {contest && (
                  <ContestLink
                    contestId={contest.Id}
                    contestName={contest.Name}
                  />
                )}
              </td>
            </tr>
            <tr key="problem-tags">
              <th>Tags</th>
              <td>{problem.Tags}</td>
            </tr>
            <tr key="problem-difficulty">
              <th>Difficulty</th>
              <td>
                {difficultyDetailData.difficulty === -1
                  ? '-'
                  : difficultyDetailData.difficulty}
              </td>
            </tr>
            <tr key="problem-solved-users">
              <th>Solved Users</th>
              <td>
                {problem.Statistics ? `${problem.Statistics.Solved}` : '-'}
              </td>
            </tr>
            <tr key="problem-submitters">
              <th>Submitters</th>
              <td>
                {problem.Statistics ? `${problem.Statistics.Total}` : '-'}
              </td>
            </tr>
            <tr key="problem-shortest">
              <th>Shortest</th>
              <td>
                {shortestRankingProblem ? (
                  <SubmissionLink
                    submissionId={shortestRankingProblem.SubmissionId}
                    submissionTitle={`#${shortestRankingProblem.SubmissionId} (${shortestRankingProblem.UserName}, ${shortestRankingProblem.Length} Bytes)`}
                  />
                ) : problem.Statistics &&
                  problem.Statistics.ShortCodeSubmissionId > 0 ? (
                  <SubmissionLink
                    submissionId={problem.Statistics.ShortCodeSubmissionId}
                    submissionTitle={`#${problem.Statistics.ShortCodeSubmissionId}`}
                  />
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr key="problem-pure-shortest">
              <th>Pure Shortest</th>
              <td>
                {pureShortestRankingProblem ? (
                  <SubmissionLink
                    submissionId={pureShortestRankingProblem.SubmissionId}
                    submissionTitle={`#${pureShortestRankingProblem.SubmissionId} (${pureShortestRankingProblem.UserName}, ${pureShortestRankingProblem.Length} Bytes)`}
                  />
                ) : problem.Statistics &&
                  problem.Statistics.PureShortCodeSubmissionId > 0 ? (
                  <SubmissionLink
                    submissionId={problem.Statistics.PureShortCodeSubmissionId}
                    submissionTitle={`#${problem.Statistics.PureShortCodeSubmissionId}`}
                  />
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr key="problem-first-accepted">
              <th>First Accepted</th>
              <td>
                {problem.Statistics &&
                problem.Statistics.FirstACSubmissionId > 0 ? (
                  <SubmissionLink
                    submissionId={problem.Statistics.FirstACSubmissionId}
                    submissionTitle={`#${problem.Statistics.FirstACSubmissionId} (${problem.Statistics.FirstAcceptedTimeSecond} seconds)`}
                  />
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr key="problem-fastest">
              <th>Fastest</th>
              <td>
                {problem.Statistics &&
                problem.Statistics.FastSubmissionId > 0 ? (
                  <SubmissionLink
                    submissionId={problem.Statistics.FastSubmissionId}
                    submissionTitle={`#${problem.Statistics.FastSubmissionId}`}
                  />
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr key="problem-type">
              <th>Problem Type</th>
              <td>
                <ProblemTypeIconSpanWithName
                  problemType={problem.ProblemType}
                />
              </td>
            </tr>
            <tr key="problem-no">
              <th>No</th>
              <td>{problem.No}</td>
            </tr>
            <tr key="problem-id">
              <th>ProblemId</th>
              <td>{problem.ProblemId}</td>
            </tr>
          </tbody>
        </Table>
      </Row>
    </>
  );
};
