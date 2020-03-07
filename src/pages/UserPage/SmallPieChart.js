import React from "react";
import { Col, Row } from "reactstrap";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = {
  Accepted: "#32cd32",
  Trying: "#58616a"
};

const SmallPieChart = props => {
  const {
    title,
    trying,
    accepted
  } = props;

  const data = [
    { value: accepted, color: COLORS.Accepted, name: "Accepted" },
    { value: trying, color: COLORS.Trying, name: "Trying" }
  ];
  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie dataKey="value" data={data} outerRadius="80%" fill="#ff0000">
            {data.map(e => (
              <Cell key={e.name} fill={e.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <h5>{title}</h5>
      <h5 className="text-muted">{`${accepted} / ${accepted + trying}`}</h5>
    </div>
  );
};

export const PieCharts = props => {
  const {
    problems, // { total: number; solved: number }[]
    title
  } = props;
  return (
    <div>
      <Row className="my-2 border-bottom">
        <h1>{title}</h1>
      </Row>
      <Row className="my-3">
        {problems.map(({ solved, total }, i) => {
          const key = "ABCDEF".charAt(i) + (i >= 5 ? "〜" : "");
          return (
            <Col
              key={key}
              className="text-center"
              xs="6"
              md={12 / problems.length}
            >
              <SmallPieChart
                accepted={solved}
                trying={total - solved}
                title={`Problem ${key}`}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
}