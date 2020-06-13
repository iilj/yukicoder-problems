import { Table, Row, Spinner } from 'reactstrap';
import React from 'react';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { SubmitTimespan } from '../../components/SubmitTimespan';
import { ProblemTypeIconAbsoluteSpan } from '../../components/ProblemTypeIcon';
import { Contest } from '../../interfaces/Contest';
import { Problem, ProblemId, ProblemNo } from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';

export const ContestTable = (props: {
  title: string;
  contests: Contest[];
  problemsMap: Map<ProblemId, Problem>;
  solvedProblemsMap: Map<ProblemId, SolvedProblem>;
  showDifficultyLevel: boolean;
  showContestResult: boolean;
  universalStateLoaded: boolean;
}): JSX.Element => {
  const {
    contests,
    problemsMap,
    solvedProblemsMap,
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
        <h2>{props.title}</h2>
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
                    if (problemsMap !== undefined && problemsMap.has(pid)) {
                      const problem = problemsMap.get(pid) as Problem;
                      const solvedProblem =
                        solvedProblemsMap && solvedProblemsMap.has(pid)
                          ? solvedProblemsMap.get(pid)
                          : undefined;
                      let className: string;
                      if (!solvedProblem) {
                        className = 'table-problem';
                      } else {
                        const solvedDate = Date.parse(solvedProblem.Date);
                        const startDate = Date.parse((contest as Contest).Date);
                        const endDate = Date.parse(
                          (contest as Contest).EndDate
                        );
                        if (!showContestResult || solvedDate > endDate)
                          className = 'table-problem table-problem-solved';
                        else if (solvedDate >= startDate)
                          className =
                            'table-problem table-problem-solved-intime';
                        else
                          className =
                            'table-problem table-problem-solved-before-contest';
                      }

                      const problemTitle = `${header[i]}. ${problem.Title}`;

                      return (
                        <td key={pid} className={className}>
                          <DifficultyStarsAbsoluteSpan
                            level={problem.Level}
                            showDifficultyLevel={showDifficultyLevel}
                          />
                          <ProblemTypeIconAbsoluteSpan
                            problemType={problem.ProblemType}
                          />
                          <ProblemLink
                            problemNo={problem.No as ProblemNo}
                            problemTitle={problemTitle}
                            level={problem.Level}
                            showDifficultyLevel={showDifficultyLevel}
                          />
                          <SubmitTimespan
                            contest={contest}
                            solvedProblem={solvedProblem}
                            showContestResult={showContestResult}
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={pid}>
                        (Id=
                        {pid})
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
