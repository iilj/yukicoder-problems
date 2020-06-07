import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import React from 'react';
import { Row } from 'reactstrap';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { SubmitTimespan } from '../../components/SubmitTimespan';
import { ProblemTypeIconAbsoluteSpan } from '../../components/ProblemTypeIcon';
import { Contest } from '../../interfaces/Contest';
import { Problem, ProblemId, ProblemNo } from '../../interfaces/Problem';

export const YukicoderRegularTable = (props: {
  title: string;
  contests: Contest[];
  problemsMap: Map<ProblemId, Problem>;
  solvedProblemsMap: Map<ProblemId, Problem>;
  showDifficultyLevel: boolean;
  showContestResult: boolean;
}) => {
  const {
    contests,
    problemsMap,
    solvedProblemsMap,
    showDifficultyLevel,
    showContestResult,
  } = props;
  const maxProblemCount = contests.reduce(
    (currentCount, contest) => Math.max(contest.ProblemIdList.length, currentCount),
    0,
  );

  const header = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].slice(0, maxProblemCount);
  return (
    <Row className="my-4">
      <h2>{props.title}</h2>
      <BootstrapTable
        data={contests.sort((a, b) => (a.Date < b.Date ? 1 : -1))}
        tableContainerClass="contest-table contest-regular-table"
      >
        <TableHeaderColumn
          isKey
          dataField="Name"
          columnClassName={(_, contest: Contest) => {
            const startDate = Date.parse(contest.Date);
            const endDate = Date.parse(contest.EndDate);
            const ls = contest.ProblemIdList.map((pid: ProblemId) => {
              const problem = problemsMap && problemsMap.has(pid) ? problemsMap.get(pid) : undefined;
              if (!problem) return 0;
              const solvedProblem = solvedProblemsMap && solvedProblemsMap.has(pid)
                ? solvedProblemsMap.get(pid)
                : undefined;
              if (!solvedProblem) return 0;
              const solvedDate = Date.parse(solvedProblem.Date as string);
              if (solvedDate > endDate) return 1;
              // solved
              if (solvedDate >= startDate) return 2;
              // intime
              return 3; // before contest
            });
            if (showContestResult && ls.every((stat) => stat === 3)) return 'table-problem table-problem-solved-before-contest';
            if (showContestResult && ls.every((stat) => stat >= 2)) return 'table-problem table-problem-solved-intime';
            if (ls.every((stat) => stat >= 1)) return 'table-problem table-problem-solved';
            return 'table-problem';
          }}
          dataFormat={(_, contest: Contest) => (
            <ContestLink
              contestId={contest.Id}
              contestName={contest.Name.replace(/^yukicoder contest /, '')}
              rawContestName={contest.Name}
            />
          )}
        >
          Contest
        </TableHeaderColumn>
        {header.map((c, i) => (
          <TableHeaderColumn
            dataField={c}
            key={c}
            columnClassName={(_, contest: Contest) => {
              const pid = i in contest.ProblemIdList ? contest.ProblemIdList[i] : undefined;
              const problem = pid !== undefined && problemsMap && problemsMap.has(pid)
                ? problemsMap.get(pid)
                : undefined;
              const solvedProblem = pid !== undefined && solvedProblemsMap && solvedProblemsMap.has(pid)
                ? solvedProblemsMap.get(pid)
                : undefined;
              if (!pid) {
                return 'table-problem-empty';
              }
              if (!problem || !solvedProblem) {
                return 'table-problem';
              }
              const solvedDate = Date.parse(solvedProblem.Date as string);
              const startDate = Date.parse(contest.Date);
              const endDate = Date.parse(contest.EndDate);
              if (!showContestResult || solvedDate > endDate) return 'table-problem table-problem-solved';
              if (solvedDate >= startDate) return 'table-problem table-problem-solved-intime';
              return 'table-problem table-problem-solved-before-contest';
            }}
            dataFormat={(_, contest: Contest) => {
              const pid = i in contest.ProblemIdList ? contest.ProblemIdList[i] : undefined;
              const problem = pid !== undefined && problemsMap && problemsMap.has(pid)
                ? problemsMap.get(pid)
                : undefined;
              const solvedProblem = pid !== undefined && solvedProblemsMap && solvedProblemsMap.has(pid)
                ? solvedProblemsMap.get(pid)
                : undefined;
              if (!pid) {
                return '';
              }
              if (!problem) {
                return (
                  <span>
                    (Id=
                    {pid}
                    )
                  </span>
                );
              }

              const problemTitle = `${header[i]}. ${problem.Title}`;

              return (
                <>
                  <DifficultyStarsAbsoluteSpan
                    level={problem.Level}
                    showDifficultyLevel={showDifficultyLevel}
                  />
                  <ProblemTypeIconAbsoluteSpan problemType={problem.ProblemType} />
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
                </>
              );
            }}
          >
            {c}
          </TableHeaderColumn>
        ))}
      </BootstrapTable>
    </Row>
  );
};
