import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'reactstrap';
import { Modal, Button } from 'react-bootstrap';
import dataFormat from 'dateformat';
import * as TypedCachedApiClient from '../utils/TypedCachedApiClient';
import { RankingMergedProblem } from '../interfaces/MergedProblem';
import { Problem, ProblemNo } from '../interfaces/Problem';
import { ContestId } from '../interfaces/Contest';
import { DifficultyStars } from './DifficultyStars';
import { ProblemLink } from './ProblemLink';
import { ContestLink } from './ContestLink';
import { SolvedCheckIcon } from './SolvedCheckIcon';
import { SubmissionLink } from './SubmissionLink';
import { ProblemTypeIconSpanWithName } from './ProblemTypeIcon';

interface Props {
  show: boolean;
  handleClose: () => void;
  rankingMergedProblem: RankingMergedProblem;
  showDifficultyLevel: boolean;
}

const initialUniversalState = {
  problem: {} as Problem,
};

export const ProblemDetailModal: React.FC<Props> = (props) => {
  const {
    show,
    handleClose,
    rankingMergedProblem,
    showDifficultyLevel,
  } = props;

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const problem = await TypedCachedApiClient.cachedSingleProblem(
        rankingMergedProblem.ProblemId
      );

      if (!unmounted) {
        setUniversalState({
          problem,
        });
        setUniversalStateLoaded(true);
      }
    };
    if (show) {
      void getUniversalInfo();
    }
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [show, rankingMergedProblem.ProblemId]);

  const { problem } = universalState;

  const shortestRankingProblem = rankingMergedProblem.ShortestRankingProblem;
  const pureShortestRankingProblem =
    rankingMergedProblem.PureShortestRankingProblem;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{rankingMergedProblem.Title}</Modal.Title>
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
                  problemTitle={rankingMergedProblem.Title}
                  problemNo={rankingMergedProblem.No as ProblemNo}
                  level={rankingMergedProblem.Level}
                  showDifficultyLevel
                />
              </td>
            </tr>
            <tr key="problem-date">
              <th>Date</th>
              <td>
                {dataFormat(
                  new Date(rankingMergedProblem.Date as string),
                  'yyyy/mm/dd HH:MM'
                )}
              </td>
            </tr>
            <tr key="problem-level">
              <th>Level</th>
              <td>
                <DifficultyStars
                  level={rankingMergedProblem.Level}
                  showDifficultyLevel={showDifficultyLevel}
                />
              </td>
            </tr>
            <tr key="problem-contest">
              <th>Contest</th>
              <td>
                <ContestLink
                  contestId={rankingMergedProblem.Contest?.Id as ContestId}
                  contestName={rankingMergedProblem.Contest?.Name as string}
                />
              </td>
            </tr>
            <tr key="problem-solve-date">
              <th>Solve Date</th>
              <td>
                {rankingMergedProblem.SolveDate ? (
                  <>
                    <SolvedCheckIcon />
                    {dataFormat(
                      new Date(rankingMergedProblem.SolveDate),
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
              <td>{rankingMergedProblem.Tags}</td>
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
                  problemType={rankingMergedProblem.ProblemType}
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
