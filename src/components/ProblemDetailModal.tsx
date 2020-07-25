import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'reactstrap';
import { Modal, Button } from 'react-bootstrap';
import dataFormat from 'dateformat';
import * as TypedCachedApiClient from '../utils/TypedCachedApiClient';
import { MergedProblem } from '../interfaces/MergedProblem';
import { Problem, ProblemNo } from '../interfaces/Problem';
import { ContestId } from '../interfaces/Contest';
import { RankingProblem } from '../interfaces/RankingProblem';
import { DifficultyStars } from './DifficultyStars';
import { ProblemLink } from './ProblemLink';
import { ContestLink } from './ContestLink';
import { SolvedCheckIcon } from './SolvedCheckIcon';
import { SubmissionLink } from './SubmissionLink';
import { ProblemTypeIconSpanWithName } from './ProblemTypeIcon';

interface Props {
  show: boolean;
  handleClose: () => void;
  mergedProblem: MergedProblem;
  showDifficultyLevel: boolean;
}

const initialUniversalState = {
  problem: {} as Problem,
  golferProblemMap: new Map<ProblemNo, RankingProblem>(),
  golferPureProblemMap: new Map<ProblemNo, RankingProblem>(),
};

export const ProblemDetailModal: React.FC<Props> = (props) => {
  const { show, handleClose, mergedProblem, showDifficultyLevel } = props;

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const [
        problem,
        golferProblemMap,
        golferPureProblemMap,
      ] = await Promise.all([
        TypedCachedApiClient.cachedSingleProblem(mergedProblem.ProblemId),
        TypedCachedApiClient.cachedGolferRankingProblemMap(),
        TypedCachedApiClient.cachedGolferRankingPureProblemMap(),
      ]);

      if (!unmounted) {
        setUniversalState({
          problem,
          golferProblemMap,
          golferPureProblemMap,
        });
        setUniversalStateLoaded(true);
      }
    };
    if (show) {
      console.log(mergedProblem.ProblemId, show);
      void getUniversalInfo();
    }
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [show, mergedProblem.ProblemId]);

  const { problem, golferProblemMap, golferPureProblemMap } = universalState;

  const shortestRankingProblem = golferProblemMap.get(
    mergedProblem.No as ProblemNo
  );
  const pureShortestRankingProblem = golferPureProblemMap.get(
    mergedProblem.No as ProblemNo
  );

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{mergedProblem.Title}</Modal.Title>
        {universalStateLoaded ? (
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
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover responsive>
          <tbody>
            <tr key="problem-title">
              <th>Title</th>
              <td>
                <ProblemLink
                  problemTitle={mergedProblem.Title}
                  problemNo={mergedProblem.No as ProblemNo}
                  level={mergedProblem.Level}
                  showDifficultyLevel
                />
              </td>
            </tr>
            <tr key="problem-date">
              <th>Date</th>
              <td>
                {dataFormat(
                  new Date(mergedProblem.Date as string),
                  'yyyy/mm/dd HH:MM'
                )}
              </td>
            </tr>
            <tr key="problem-level">
              <th>Level</th>
              <td>
                <DifficultyStars
                  level={mergedProblem.Level}
                  showDifficultyLevel={showDifficultyLevel}
                />
              </td>
            </tr>
            <tr key="problem-contest">
              <th>Contest</th>
              <td>
                <ContestLink
                  contestId={mergedProblem.Contest?.Id as ContestId}
                  contestName={mergedProblem.Contest?.Name as string}
                />
              </td>
            </tr>
            <tr key="problem-solve-date">
              <th>Solve Date</th>
              <td>
                {mergedProblem.SolveDate ? (
                  <>
                    <SolvedCheckIcon />
                    {dataFormat(
                      new Date(mergedProblem.SolveDate),
                      'yyyy/mm/dd HH:MM'
                    )}
                  </>
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr key="problem-tegs">
              <th>Tags</th>
              <td>{mergedProblem.Tags}</td>
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
                ) : (
                  <></>
                )}
              </td>
            </tr>
            <tr key="problem-first-accepted">
              <th>First Accepted</th>
              <td>
                {problem.Statistics ? (
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
                {problem.Statistics ? (
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
                  problemType={mergedProblem.ProblemType}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
