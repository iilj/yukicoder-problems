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
    solvedProblemsMap,
    statusFilterState,
    fromDifficultyLevel,
    toDifficultyLevel
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
      header: "Solve Date",
      dataField: "SolveDate",
      dataSort: true,
      dataFormat: (solveDate) => solveDate ? <>{dataFormat(new Date(solveDate), "yyyy/mm/dd HH:MM")}</> : null
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
            .filter(problem => fromDifficultyLevel <= problem.Level && problem.Level <= toDifficultyLevel)
            .map(problem => {
              problem.Contest = (contestMap && problemContestMap)
                ? contestMap[problemContestMap[problem.ProblemId]]
                : null;
              problem.SolveDate = (solvedProblemsMap && problem.ProblemId in solvedProblemsMap)
                ? solvedProblemsMap[problem.ProblemId].Date : undefined;
              return problem;
            })
            .filter(problem => {
              switch (statusFilterState) {
                case "All":
                  return true;
                case "Only AC":
                  return !!problem.SolveDate;
                case "Only Trying":
                  return !problem.SolveDate;
                default:
                  return true;
              }
            })
            .sort((a, b) => a.Date < b.Date ? 1 : -1)
        }
        trClassName={(problem) => {
          if (!problem.SolveDate)
            return "table-problem";
          if (!problem.Contest)
            return "table-problem";
          const solveDate = Date.parse(problem.SolveDate);
          const startDate = Date.parse(problem.Contest.Date)
          const endDate = Date.parse(problem.Contest.EndDate);
          if (solveDate > endDate)
            return "table-problem table-problem-solved";
          else if (solveDate >= startDate)
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