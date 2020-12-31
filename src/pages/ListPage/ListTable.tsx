import {
  BootstrapTable,
  SortOrder,
  TableHeaderColumn,
} from 'react-bootstrap-table';
import React, { useState } from 'react';
import { Button } from 'reactstrap';
import dataFormat from 'dateformat';
import { DifficultyStars } from '../../components/DifficultyStars';
import {
  ProblemLink,
  ProblemLinkColorMode,
} from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { SubmissionLink } from '../../components/SubmissionLink';
import {
  ListPaginationPanel,
  ListPaginationPanelProps,
} from '../../components/ListPaginationPanel';
import { ProblemTypeIconSpanWithName } from '../../components/ProblemTypeIcon';
import { ProblemLevel, ProblemNo, ProblemType } from '../../interfaces/Problem';
import { Contest } from '../../interfaces/Contest';
import { RankingProblem } from '../../interfaces/RankingProblem';
import {
  RankingMergedProblem,
  ProblemSolveStatus,
} from '../../interfaces/MergedProblem';
import { ProblemDetailModal } from '../../components/ProblemDetailModal';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

export type FilterState = 'All' | 'Only Trying' | 'Only AC';

interface Props {
  rankingMergedProblems: RankingMergedProblem[];
  statusFilterState: FilterState;
  fromDifficultyLevel: ProblemLevel | -1;
  toDifficultyLevel: ProblemLevel | 100;
  fromDate?: Date;
  toDate?: Date;
  problemTypeFilterState: ProblemType | 'All';
  showTagsOfTryingProblems: boolean;
  problemLinkColorMode: ProblemLinkColorMode;
}

const SORT_NAMES = [
  'Date',
  'Title',
  'Level',
  'Contest',
  'SolveDate',
  'FirstSolveDate',
  'Tags',
  'Difficulty',
  'FastestRankingProblem',
  'ShortestRankingProblem',
  'PureShortestRankingProblem',
  'ProblemType',
  'No',
  'ProblemId',
] as const;
type SortName = typeof SORT_NAMES[number];
const sanitizeColumnName = (sortName: string | null): SortName => {
  if (SORT_NAMES.includes(sortName as SortName)) return sortName as SortName;
  else return 'Date';
};
const sanitizeSortOrder = (sortOrder: string | null): SortOrder => {
  if (sortOrder == 'asc' || sortOrder == 'desc') return sortOrder;
  else return 'desc';
};

export const ListTable: React.FC<Props> = (props) => {
  const {
    rankingMergedProblems,
    statusFilterState,
    fromDifficultyLevel,
    toDifficultyLevel,
    fromDate,
    toDate,
    problemTypeFilterState,
    showTagsOfTryingProblems,
    problemLinkColorMode,
  } = props;
  const navigate = useNavigate();
  const [showDetailsModalStatus, setShowDetailsModalStatus] = useState<{
    enabled: boolean;
    rankingMergedProblem?: RankingMergedProblem;
  }>({
    enabled: false,
    rankingMergedProblem: undefined,
  });

  const [searchParams, setSearchParams] = useSearchParams();

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
      dataFormat: function _dataFormat(
        title: string,
        row: RankingMergedProblem
      ) {
        return (
          <ProblemLink
            problemTitle={title}
            problemNo={row.No as ProblemNo}
            level={row.Level}
            problemLinkColorMode={problemLinkColorMode}
            difficulty={row.Difficulty}
            augmented={row.Augmented}
            id={`ListTable-ProblemLink-${row.ProblemId}`}
          />
        );
      },
    },
    {
      header: 'Level',
      dataField: 'Level',
      dataSort: true,
      dataFormat: function _dataFormat(level: ProblemLevel) {
        return (
          <DifficultyStars
            level={level}
            showDifficultyLevel={true}
            color={problemLinkColorMode === 'Level'}
          />
        );
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
      header: 'First Solve Date',
      dataField: 'FirstSolveDate',
      dataSort: true,
      dataFormat: function _dataFormat(firstSolveDate: string) {
        return firstSolveDate ? (
          <>{dataFormat(new Date(firstSolveDate), 'yyyy/mm/dd HH:MM')}</>
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
        row: RankingMergedProblem
      ): React.ReactElement {
        return showTagsOfTryingProblems || row.FirstSolveDate ? (
          <>{tags}</>
        ) : (
          <></>
        );
      },
    },
    {
      header: 'Difficulty',
      dataField: 'Difficulty',
      dataSort: true,
    },
    {
      header: 'Fastest',
      dataField: 'FastestRankingProblem',
      dataSort: true,
      dataFormat: function _dataFormat(
        fastestRankingProblem: RankingProblem
      ): React.ReactElement {
        return fastestRankingProblem ? (
          <SubmissionLink
            submissionId={fastestRankingProblem.SubmissionId}
            submissionTitle={`${fastestRankingProblem.UserName}`}
          />
        ) : (
          <></>
        );
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
          <SubmissionLink
            submissionId={shortestRankingProblem.SubmissionId}
            submissionTitle={`${shortestRankingProblem.UserName} (${shortestRankingProblem.Length} Bytes)`}
          />
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
          <SubmissionLink
            submissionId={pureShortestRankingProblem.SubmissionId}
            submissionTitle={`${pureShortestRankingProblem.UserName} (${pureShortestRankingProblem.Length} Bytes)`}
          />
        ) : (
          <></>
        );
      },
    },
    {
      header: 'Type',
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
      header: 'Detail',
      dataField: 'No',
      dataFormat: function _dataFormat(
        problemNo: ProblemNo,
        row: RankingMergedProblem
      ) {
        return (
          <Button
            color="secondary"
            size="sm"
            onClick={() => navigate(`/problem-detail/${row.ProblemId}`)}
          >
            Detail
          </Button>
        );
      },
      dataSort: true,
    },
    {
      header: 'Contest name for Search',
      dataField: 'ContestName',
      hidden: true,
    },
    {
      header: 'Fastest User for Search',
      dataField: 'FastestRankingUserName',
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
        data={rankingMergedProblems
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
          .filter((problem) => {
            switch (statusFilterState) {
              case 'All':
                return true;
              case 'Only AC':
                return problem.SolveStatus !== ProblemSolveStatus.Trying;
              case 'Only Trying':
                return problem.SolveStatus === ProblemSolveStatus.Trying;
              default:
                return true;
            }
          })
          .filter((problem) => {
            if (fromDate === undefined && toDate === undefined) return true;
            if (problem.Date === null) return false;
            const startDate = new Date(problem.Date);
            if (fromDate === undefined) return startDate <= (toDate as Date);
            if (toDate === undefined) return fromDate <= startDate;
            return fromDate <= startDate && startDate <= toDate;
          })
          .sort((a, b) => {
            if (a.Date === null) return 1;
            if (b.Date === null) return -1;
            return a.Date < b.Date ? 1 : -1;
          })}
        trClassName={(problem: RankingMergedProblem) => {
          if (problem.SolveStatus === ProblemSolveStatus.Trying)
            return 'table-problem';
          if (!problem.Contest) return 'table-problem table-problem-solved';
          if (problem.SolveStatus === ProblemSolveStatus.Solved)
            return 'table-problem table-problem-solved';
          if (problem.SolveStatus === ProblemSolveStatus.Intime)
            return 'table-problem table-problem-solved-intime';
          return 'table-problem table-problem-solved-before-contest';
        }}
        options={{
          paginationPosition: 'top',
          page: Number(searchParams.get('page') ?? 1),
          sizePerPage: Number(searchParams.get('sizePerPage') ?? 20),
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
              value: rankingMergedProblems.length,
            },
          ],
          onSizePerPageList: function _onSizePerPageList(sizePerPage: number) {
            searchParams.set('page', `1`);
            searchParams.set('sizePerPage', `${sizePerPage}`);
            setSearchParams(searchParams);
          },
          onPageChange: function _onPageChange(
            page: number,
            sizePerPage: number
          ) {
            searchParams.set('page', `${page}`);
            searchParams.set('sizePerPage', `${sizePerPage}`);
            setSearchParams(searchParams);
          },
          paginationPanel: function _paginationPanel(
            paginationPanelProps: ListPaginationPanelProps
          ) {
            return <ListPaginationPanel {...paginationPanelProps} />;
          },
          defaultSortName: sanitizeColumnName(searchParams.get('sortName')),
          defaultSortOrder: sanitizeSortOrder(searchParams.get('sortOrder')),
          onSortChange: function _onSortChange(
            sortName: string | number | symbol,
            sortOrder: SortOrder
          ) {
            searchParams.set('sortName', sortName as string);
            searchParams.set('sortOrder', sortOrder);
            setSearchParams(searchParams);
          },
          defaultSearch: searchParams.get('search') ?? '',
          onSearchChange: function _onSearchChange(searchText: string) {
            searchParams.set('page', `1`);
            searchParams.set('search', searchText);
            setSearchParams(searchParams, { replace: true });
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

      {showDetailsModalStatus.enabled &&
      showDetailsModalStatus.rankingMergedProblem ? (
        <ProblemDetailModal
          show={showDetailsModalStatus.enabled}
          handleClose={() =>
            setShowDetailsModalStatus({
              enabled: false,
              rankingMergedProblem: undefined,
            })
          }
          rankingMergedProblem={showDetailsModalStatus.rankingMergedProblem}
          problemLinkColorMode={problemLinkColorMode}
          showTagsOfTryingProblems={showTagsOfTryingProblems}
        />
      ) : (
        <></>
      )}
    </>
  );
};
