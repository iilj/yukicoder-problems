import React from "react";
import { Row } from "reactstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import dataFormat from "dateformat"

export const DailyEffortBarChart = props => {
  if (props.dailyData.length === 0)
    return null;

  return (
    <Row className="my-3">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={props.dailyData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateSecond"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(dateSecond) =>
              dataFormat(new Date(dateSecond), "yyyy/mm/dd")
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(dateSecond) =>
              dataFormat(new Date(Number(dateSecond)), "yyyy/mm/dd")
            }
          />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Row>
  )
};
