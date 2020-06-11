import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import React from 'react';
import { Row, Spinner } from 'reactstrap';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { SubmitTimespan } from '../../components/SubmitTimespan';
import { ProblemTypeIconAbsoluteSpan } from '../../components/ProblemTypeIcon';
import { Contest } from '../../interfaces/Contest';
import { Problem, ProblemId, ProblemNo } from '../../interfaces/Problem';

enum ProblemSolveStatus {
  Trying = 0,
  Solved = 1,
  Intime = 2,
  BeforeContest = 3,
}

export const YukicoderRegularTable = (props: {
  title: string;
  contests: Contest[];
  problemsMap: Map<ProblemId, Problem>;
  solvedProblemsMap: Map<ProblemId, Problem>;
  showDifficultyLevel: boolean;
  showContestResult: boolean;
  universalStateLoaded: boolean;
}) => {
  const {
    contests,
    problemsMap,
    solvedProblemsMap,
    showDifficultyLevel,
    showContestResult,
    universalStateLoaded,
  } = props;

  const maxProblemCount = contests.reduce(
    (currentCount, contest) => Math.max(contest.ProblemIdList.length, currentCount),
    0,
  );

  const header = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].slice(0, maxProblemCount);
  return (
    <Row className="my-4">
      <h2>{props.title}</h2>
      {universalStateLoaded ? (
        <></>
      ) : (
        <Spinner style={{ width: '2.5rem', height: '2.5rem', marginLeft: '0.8rem' }} />
      )}
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
              if (!problem) return ProblemSolveStatus.Trying;
              const solvedProblem = solvedProblemsMap && solvedProblemsMap.has(pid)
                ? solvedProblemsMap.get(pid)
                : undefined;
              if (!solvedProblem) return ProblemSolveStatus.Trying;
              const solvedDate = Date.parse(solvedProblem.Date as string);
              if (solvedDate > endDate) return ProblemSolveStatus.Solved;
              if (solvedDate >= startDate) return ProblemSolveStatus.Intime;
              return ProblemSolveStatus.BeforeContest;
            });
            if (showContestResult && ls.every((stat) => stat === ProblemSolveStatus.BeforeContest)) return 'table-problem table-problem-solved-before-contest';
            if (showContestResult && ls.every((stat) => stat >= ProblemSolveStatus.Intime)) return 'table-problem table-problem-solved-intime';
            if (ls.every((stat) => stat >= ProblemSolveStatus.Solved)) return 'table-problem table-problem-solved';
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
