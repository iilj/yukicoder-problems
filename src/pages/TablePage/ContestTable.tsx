import { Table, Row, Spinner } from 'reactstrap';
import React from 'react';
import dataFormat from 'dateformat';
import {
  ProblemLink,
  ProblemLinkColorMode,
} from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { SubmitTimespan } from '../../components/SubmitTimespan';
import { SolvedCheckIcon } from '../../components/SolvedCheckIcon';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { ProblemTypeIconAbsoluteSpan } from '../../components/ProblemTypeIcon';
import { getHeader } from '../../utils';
import { Contest } from '../../interfaces/Contest';
import { ProblemId, ProblemNo } from '../../interfaces/Problem';
import {
  MergedProblem,
  ProblemSolveStatus,
} from '../../interfaces/MergedProblem';

interface Props {
  title: string;
  contests: Contest[];
  mergedProblemsMap: Map<ProblemId, MergedProblem>;
  problemLinkColorMode: ProblemLinkColorMode;
  showDifficultyLevel: boolean;
  showContestResult: boolean;
  showContestDate: boolean;
  universalStateLoaded: boolean;
}

export const ContestTable: React.FC<Props> = (props) => {
  const {
    contests,
    mergedProblemsMap,
    problemLinkColorMode,
    showDifficultyLevel,
    showContestResult,
    showContestDate,
    universalStateLoaded,
  } = props;

  return (
    <>
      <Row className="my-4">
        <h3>{props.title}</h3>
        {universalStateLoaded ? (
          <></>
        ) : (
          <Spinner
            style={{ width: '2.5rem', height: '2.5rem', marginLeft: '0.8rem' }}
          />
        )}
      </Row>
      <div className="my-inner-container">
        {contests.map((contest) => (
          <div key={contest.Id} className="contest-table">
            <strong>
              {contest.ProblemIdList.map((pid: ProblemId) =>
                mergedProblemsMap.get(pid)
              ).every(
                (mergedProblem) =>
                  mergedProblem &&
                  mergedProblem.SolveStatus >= ProblemSolveStatus.Solved
              ) ? (
                <SolvedCheckIcon />
              ) : (
                <></>
              )}
              <ContestLink contestId={contest.Id} contestName={contest.Name} />
            </strong>
            {showContestDate && (
              <span className="table-contest-date-span">
                ({dataFormat(Date.parse(contest.Date), 'yyyy/mm/dd')})
              </span>
            )}
            <Table striped bordered hover className="contest-other-table">
              <tbody>
                <tr>
                  {contest.ProblemIdList.map((pid: ProblemId, i) => {
                    if (pid < 0) return null;
                    const mergedProblem = mergedProblemsMap.get(pid);
                    if (!mergedProblem) {
                      return (
                        <td key={pid}>
                          (Id=
                          {pid})
                        </td>
                      );
                    }
                    const className =
                      mergedProblem.SolveStatus === ProblemSolveStatus.Trying
                        ? 'table-problem'
                        : !showContestResult ||
                          mergedProblem.SolveStatus ===
                            ProblemSolveStatus.Solved
                        ? 'table-problem table-problem-solved'
                        : mergedProblem.SolveStatus ===
                          ProblemSolveStatus.Intime
                        ? 'table-problem table-problem-solved-intime'
                        : 'table-problem table-problem-solved-before-contest';

                    const problemTitle = `${getHeader(i)}. ${
                      mergedProblem.Title
                    }`;

                    return (
                      <td key={pid} className={className}>
                        <DifficultyStarsAbsoluteSpan
                          level={mergedProblem.Level}
                          showDifficultyLevel={showDifficultyLevel}
                          color={problemLinkColorMode === 'Level'}
                        />
                        <ProblemTypeIconAbsoluteSpan
                          problemType={mergedProblem.ProblemType}
                        />
                        <ProblemLink
                          problemNo={mergedProblem.No as ProblemNo}
                          problemTitle={problemTitle}
                          level={mergedProblem.Level}
                          problemLinkColorMode={problemLinkColorMode}
                          id={`lnk-contest-table-${mergedProblem.ProblemId}`}
                          difficulty={mergedProblem.Difficulty}
                          augmented={mergedProblem.Augmented}
                        />
                        <SubmitTimespan
                          mergedProblem={mergedProblem}
                          showContestResult={showContestResult}
                        />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </>
  );
};
