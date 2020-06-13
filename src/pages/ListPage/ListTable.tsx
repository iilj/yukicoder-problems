import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import React from 'react';
import dataFormat from 'dateformat';
import { DifficultyStars } from '../../components/DifficultyStars';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import {
  ListPaginationPanel,
  ListPaginationPanelProps,
} from '../../components/ListPaginationPanel';
import { ProblemTypeIconSpanWithName } from '../../components/ProblemTypeIcon';
import { formatSubmissionUrl } from '../../utils/Url';
import {
  Problem,
  ProblemLevel,
  ProblemId,
  ProblemNo,
  ProblemType,
} from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { Contest, ContestId } from '../../interfaces/Contest';
import { RankingProblem } from '../../interfaces/RankingProblem';

export type FilterState = 'All' | 'Only Trying' | 'Only AC';

interface MergedProblem extends Problem {
  Contest: Contest;
  SolveDate: string;
  ShortestRankingProblem: RankingProblem;
  PureShortestRankingProblem: RankingProblem;
  ContestName?: string;
  ShortestRankingUserName?: string;
  PureShortestRankingUserName?: string;
}

export const ListTable = (props: {
  problems: Problem[];
  contestMap: Map<ContestId, Contest>;
  problemContestMap: Map<ProblemId, ContestId>;
  solvedProblemsMap: Map<ProblemId, SolvedProblem>;
  golferProblemMap: Map<ProblemNo, RankingProblem>;
  golferPureProblemMap: Map<ProblemNo, RankingProblem>;
  statusFilterState: FilterState;
  fromDifficultyLevel: ProblemLevel | -1;
  toDifficultyLevel: ProblemLevel | 100;
  fromDate?: Date;
  toDate?: Date;
  problemTypeFilterState: ProblemType | 'All';
  showTagsOfTryingProblems: boolean;
}): JSX.Element => {
  const {
    problems,
    contestMap,
    problemContestMap,
    solvedProblemsMap,
    golferProblemMap,
    golferPureProblemMap,
    statusFilterState,
    fromDifficultyLevel,
    toDifficultyLevel,
    fromDate,
    toDate,
    problemTypeFilterState,
    showTagsOfTryingProblems,
  } = props;
  const columns = [
    {
      header: 'Date',
      dataField: 'Date',
      dataSort: true,
      dataFormat: function _dataFormat(date: string) {
        return (
          <>
            {date !== null
              ? dataFormat(new Date(date), 'yyyy/mm/dd HH:MM')
              : '-'}
          </>
        );
      },
    },
    {
      header: 'Title',
      dataField: 'Title',
      dataSort: true,
      dataFormat: function _dataFormat(title: string, row: MergedProblem) {
        return (
          <ProblemLink
            problemTitle={title}
            problemNo={row.No as ProblemNo}
            level={row.Level}
            showDifficultyLevel
          />
        );
      },
    },
    {
      header: 'Level',
      dataField: 'Level',
      dataSort: true,
      dataFormat: function _dataFormat(level: ProblemLevel) {
        return <DifficultyStars level={level} showDifficultyLevel />;
      },
    },
    {
      header: 'Contest',
      dataField: 'Contest',
      dataSort: true,
      dataFormat: function _dataFormat(contest: Contest): React.ReactElement {
        return contest ? (
          <ContestLink contestId={contest.Id} contestName={contest.Name} />
        ) : (
          <></>
        );
      },
    },
    {
      header: 'Solve Date',
      dataField: 'SolveDate',
      dataSort: true,
      dataFormat: function _dataFormat(solveDate: string) {
        return solveDate ? (
          <>{dataFormat(new Date(solveDate), 'yyyy/mm/dd HH:MM')}</>
        ) : (
          <></>
        );
      },
    },
    {
      header: 'Tags',
      dataField: 'Tags',
      dataSort: true,
      dataFormat: function _dataFormat(
        tags: string,
        row: MergedProblem
      ): React.ReactElement {
        return showTagsOfTryingProblems || row.SolveDate ? <>{tags}</> : <></>;
      },
    },
    {
      header: 'Shortest',
      dataField: 'ShortestRankingProblem',
      dataSort: true,
      dataFormat: function _dataFormat(
        shortestRankingProblem: RankingProblem
      ): React.ReactElement {
        return shortestRankingProblem ? (
          <a
            href={formatSubmissionUrl(shortestRankingProblem.SubmissionId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortestRankingProblem.UserName} ({shortestRankingProblem.Length}{' '}
            Bytes)
          </a>
        ) : (
          <></>
        );
      },
    },
    {
      header: 'Pure Shortest',
      dataField: 'PureShortestRankingProblem',
      dataSort: true,
      dataFormat: function _dataFormat(
        pureShortestRankingProblem: RankingProblem
      ): React.ReactElement {
        return pureShortestRankingProblem ? (
          <a
            href={formatSubmissionUrl(pureShortestRankingProblem.SubmissionId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {pureShortestRankingProblem.UserName} (
            {pureShortestRankingProblem.Length} Bytes)
          </a>
        ) : (
          <></>
        );
      },
    },
    {
      header: 'ProblemType',
      dataField: 'ProblemType',
      dataFormat: function _dataFormat(problemType: ProblemType) {
        return <ProblemTypeIconSpanWithName problemType={problemType} />;
      },
      dataSort: true,
    },
    {
      header: 'No',
      dataField: 'No',
      dataSort: true,
    },
    {
      header: 'ProblemId',
      dataField: 'ProblemId',
      dataSort: true,
    },
    {
      header: 'Contest name for Search',
      dataField: 'ContestName',
      hidden: true,
    },
    {
      header: 'Shortest User for Search',
      dataField: 'ShortestRankingUserName',
      hidden: true,
    },
    {
      header: 'Pure Shortest User for Search',
      dataField: 'PureShortestRankingUserName',
      hidden: true,
    },
  ];
  return (
    <>
      <BootstrapTable
        pagination
        keyField="ProblemId"
        height="auto"
        hover
        striped
        search
        tableContainerClass="list-table"
        data={problems
          .filter(
            (problem) =>
              fromDifficultyLevel <= problem.Level &&
              problem.Level <= toDifficultyLevel
          )
          .filter((problem) => {
            switch (problemTypeFilterState) {
              case 'All':
                return true;
              default:
                return problem.ProblemType === problemTypeFilterState;
            }
          })
          .map((problem) => {
            const mappedProblem = {
              ...problem,
              Contest:
                contestMap && problemContestMap
                  ? contestMap.get(
                      problemContestMap.get(problem.ProblemId) as ContestId
                    )
                  : null,
              SolveDate:
                solvedProblemsMap && solvedProblemsMap.has(problem.ProblemId)
                  ? (solvedProblemsMap.get(problem.ProblemId) as SolvedProblem)
                      .Date
                  : undefined,
              ShortestRankingProblem:
                golferProblemMap &&
                typeof problem.No === 'number' &&
                golferProblemMap.has(problem.No)
                  ? golferProblemMap.get(problem.No)
                  : undefined,
              PureShortestRankingProblem:
                golferPureProblemMap &&
                typeof problem.No === 'number' &&
                golferPureProblemMap.has(problem.No)
                  ? golferPureProblemMap.get(problem.No)
                  : undefined,
              ContestName: undefined,
              ShortestRankingUserName: undefined,
              PureShortestRankingUserName: undefined,
            } as MergedProblem;

            // props for search
            mappedProblem.ContestName = mappedProblem.Contest
              ? mappedProblem.Contest.Name
              : undefined;
            mappedProblem.ShortestRankingUserName = mappedProblem.ShortestRankingProblem
              ? mappedProblem.ShortestRankingProblem.UserName
              : undefined;
            mappedProblem.PureShortestRankingUserName = mappedProblem.PureShortestRankingProblem
              ? mappedProblem.PureShortestRankingProblem.UserName
              : undefined;
            return mappedProblem;
          })
          .filter((problem) => {
            switch (statusFilterState) {
              case 'All':
                return true;
              case 'Only AC':
                return problem.SolveDate !== undefined;
              case 'Only Trying':
                return problem.SolveDate === undefined;
              default:
                return true;
            }
          })
          .filter((problem) => {
            if (fromDate === undefined && toDate === undefined) return true;
            if (problem.Date === null) return false;
            const startDate = new Date(problem.Date);
            if (fromDate === undefined) return startDate <= (toDate as Date);
            if (toDate === undefined) return (fromDate as Date) <= startDate;
            return fromDate <= startDate && startDate <= toDate;
          })
          .sort((a, b) => {
            if (a.Date === null) return 1;
            if (b.Date === null) return -1;
            return a.Date < b.Date ? 1 : -1;
          })}
        trClassName={(problem) => {
          if (!problem.SolveDate) return 'table-problem';
          if (!problem.Contest) return 'table-problem table-problem-solved';
          const solveDate = Date.parse(problem.SolveDate);
          const startDate = Date.parse(problem.Contest.Date);
          const endDate = Date.parse(problem.Contest.EndDate);
          if (solveDate > endDate) return 'table-problem table-problem-solved';
          if (solveDate >= startDate)
            return 'table-problem table-problem-solved-intime';
          return 'table-problem table-problem-solved-before-contest';
        }}
        options={{
          paginationPosition: 'top',
          sizePerPage: 20,
          sizePerPageList: [
            {
              text: '20',
              value: 20,
            },
            {
              text: '50',
              value: 50,
            },
            {
              text: '100',
              value: 100,
            },
            {
              text: '200',
              value: 200,
            },
            {
              text: 'All',
              value: problems.length,
            },
          ],
          paginationPanel: function _paginationPanel(
            paginationPanelProps: ListPaginationPanelProps
          ) {
            return <ListPaginationPanel {...paginationPanelProps} />;
          },
        }}
      >
        {columns.map((c) => (
          <TableHeaderColumn
            key={c.header}
            tdAttr={{ 'data-col-name': c.header }}
            {...c}
          >
            {c.header}
          </TableHeaderColumn>
        ))}
      </BootstrapTable>
    </>
  );
};
