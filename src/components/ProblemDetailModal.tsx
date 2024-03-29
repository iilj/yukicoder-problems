import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'reactstrap';
import { Modal, Button } from 'react-bootstrap';
import dataFormat from 'dateformat';
import * as TypedCachedApiClient from '../utils/TypedCachedApiClient';
import {
  RankingMergedProblem,
  ProblemSolveStatus,
} from '../interfaces/MergedProblem';
import { Problem, ProblemNo } from '../interfaces/Problem';
import { ContestId } from '../interfaces/Contest';
import { DifficultyStars } from './DifficultyStars';
import { ProblemLink, ProblemLinkColorMode } from './ProblemLink';
import { ContestLink } from './ContestLink';
import { SolvedCheckIcon } from './SolvedCheckIcon';
import { SubmissionLink } from './SubmissionLink';
import { ProblemTypeIconSpanWithName } from './ProblemTypeIcon';
import { bytesLengthToString } from '../utils';

interface Props {
  show: boolean;
  handleClose: () => void;
  rankingMergedProblem: RankingMergedProblem;
  problemLinkColorMode: ProblemLinkColorMode;
  showTagsOfTryingProblems: boolean;
}

const initialUniversalState = {
  problem: {} as Problem,
};

export const ProblemDetailModal: React.FC<Props> = (props) => {
  const {
    show,
    handleClose,
    rankingMergedProblem,
    problemLinkColorMode,
    showTagsOfTryingProblems,
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
                  problemLinkColorMode={problemLinkColorMode}
                  difficulty={rankingMergedProblem.Difficulty}
                />
              </td>
            </tr>
            <tr key="problem-date">
              <th>Date</th>
              <td>
                {rankingMergedProblem.Date
                  ? dataFormat(
                      new Date(rankingMergedProblem.Date),
                      'yyyy/mm/dd HH:MM'
                    )
                  : '-'}
              </td>
            </tr>
            <tr key="problem-level">
              <th>Level</th>
              <td>
                <DifficultyStars
                  level={rankingMergedProblem.Level}
                  showDifficultyLevel={true}
                  color={problemLinkColorMode === 'Level'}
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
            <tr key="problem-tags">
              <th>Tags</th>
              <td>
                {showTagsOfTryingProblems ||
                rankingMergedProblem.SolveStatus !== ProblemSolveStatus.Trying
                  ? rankingMergedProblem.Tags
                  : ''}
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
                    submissionTitle={`#${
                      shortestRankingProblem.SubmissionId
                    } (${
                      shortestRankingProblem.UserName
                    }, ${bytesLengthToString(shortestRankingProblem.Length)})`}
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
                    submissionTitle={`#${
                      pureShortestRankingProblem.SubmissionId
                    } (${
                      pureShortestRankingProblem.UserName
                    }, ${bytesLengthToString(
                      pureShortestRankingProblem.Length
                    )})`}
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
