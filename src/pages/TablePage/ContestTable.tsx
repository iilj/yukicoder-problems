import { Table, Row, Spinner } from 'reactstrap';
import React from 'react';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { SubmitTimespan } from '../../components/SubmitTimespan';
import { ProblemTypeIconAbsoluteSpan } from '../../components/ProblemTypeIcon';
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
  showDifficultyLevel: boolean;
  showContestResult: boolean;
  universalStateLoaded: boolean;
}

export const ContestTable: React.FC<Props> = (props) => {
  const {
    contests,
    mergedProblemsMap,
    showDifficultyLevel,
    showContestResult,
    universalStateLoaded,
  } = props;

  const header = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
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
              <ContestLink contestId={contest.Id} contestName={contest.Name} />
            </strong>
            <Table striped bordered hover className="contest-other-table">
              <tbody>
                <tr>
                  {contest.ProblemIdList.map((pid: ProblemId, i) => {
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

                    const problemTitle = `${header[i]}. ${mergedProblem.Title}`;

                    return (
                      <td key={pid} className={className}>
                        <DifficultyStarsAbsoluteSpan
                          level={mergedProblem.Level}
                          showDifficultyLevel={showDifficultyLevel}
                        />
                        <ProblemTypeIconAbsoluteSpan
                          problemType={mergedProblem.ProblemType}
                        />
                        <ProblemLink
                          problemNo={mergedProblem.No as ProblemNo}
                          problemTitle={problemTitle}
                          level={mergedProblem.Level}
                          showDifficultyLevel={showDifficultyLevel}
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
