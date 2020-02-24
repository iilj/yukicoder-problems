import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import React from "react";
import { DifficultyStars } from "../../components/DifficultyStars";
import { ProblemLink } from "../../components/ProblemLink";
import { ContestLink } from "../../components/ContestLink";
import dataFormat from "dateformat"

export const ListTable = (props) => {
  const {
    problems,
    contestMap,
    problemContestMap,
    solvedProblemsMap
  } = props;
  const columns = [
    {
      header: "Date",
      dataField: "Date",
      dataSort: true,
      dataFormat: (date) => <>{dataFormat(new Date(date), "yyyy/mm/dd HH:MM")}</>
    },
    {
      header: "Title",
      dataField: "Title",
      dataSort: true,
      dataFormat: (title, row) => <ProblemLink problemTitle={title} problemNo={row.No} level={row.Level} showDifficultyLevel={true} />
    },
    {
      header: "Level",
      dataField: "Level",
      dataSort: true,
      dataFormat: (level) => <DifficultyStars level={level} showDifficultyLevel={true} />
    },
    {
      header: "Contest",
      dataField: "Contest",
      dataSort: true,
      dataFormat: (contest) => contest ? <ContestLink contestId={contest.Id} contestName={contest.Name} /> : null
    },
    {
      header: "Tags",
      dataField: "Tags",
      dataSort: true
    },
    {
      header: "No",
      dataField: "No",
      dataSort: true
    },
    {
      header: "ProblemId",
      dataField: "ProblemId",
      dataSort: true
    }
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
        data={
          problems
            .sort((a, b) => a.Date < b.Date ? 1 : -1)
            .map(row => {
              row.Contest = (contestMap && problemContestMap && row)
                ? contestMap[problemContestMap[row.ProblemId]]
                : null;
              return row;
            })
        }
        trClassName={(problem) => {
          const solvedProblem = (solvedProblemsMap && problem.ProblemId in solvedProblemsMap)
            ? solvedProblemsMap[problem.ProblemId] : undefined;
          if (!solvedProblem)
            return "table-problem";
          const contest = problem.Contest;
          if (!contest)
            return "table-problem";
          const solvedDate = Date.parse(solvedProblem.Date);
          const startDate = Date.parse(contest.Date)
          const endDate = Date.parse(contest.EndDate);
          if (solvedDate > endDate)
            return "table-problem table-problem-solved";
          else if (solvedDate >= startDate)
            return "table-problem table-problem-solved-intime";
          else
            return "table-problem table-problem-solved-before-contest";
        }}
        options={{
          paginationPosition: "top",
          sizePerPage: 20,
          sizePerPageList: [
            {
              text: "20",
              value: 20
            },
            {
              text: "50",
              value: 50
            },
            {
              text: "100",
              value: 100
            },
            {
              text: "200",
              value: 200
            },
            {
              text: "All",
              value: problems.size
            }
          ]
        }}
      >
        {
          columns.map(c => (
            <TableHeaderColumn
              key={c.header}
              tdAttr={{ "data-col-name": c.header }}
              {...c}
            >
              {c.header}
            </TableHeaderColumn>
          ))
        }
      </BootstrapTable >
    </>
  );
}