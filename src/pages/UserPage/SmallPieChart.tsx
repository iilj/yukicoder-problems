import React from 'react';
import { Col, Row } from 'reactstrap';
import { SinglePieChart } from '../../components/SinglePieChart';

const COLORS = {
  Accepted: '#32cd32',
  Trying: '#58616a',
};

interface SmallPieChartProps {
  title: string;
  trying: number;
  accepted: number;
}

const SmallPieChart: React.FC<SmallPieChartProps> = (props) => {
  const { title, trying, accepted } = props;

  const data = [
    { value: accepted, color: COLORS.Accepted, name: 'Accepted' },
    { value: trying, color: COLORS.Trying, name: 'Trying' },
  ];
  return (
    <div>
      <SinglePieChart data={data} />
      <h5>{title}</h5>
      <h5 className="text-muted">{`${accepted} / ${accepted + trying}`}</h5>
    </div>
  );
};

interface Props {
  problems: { total: number; solved: number }[];
  title: string;
}

export const PieCharts: React.FC<Props> = (props) => {
  const { problems, title } = props;
  return (
    <div>
      <Row className="my-2 border-bottom">
        <h2>{title}</h2>
      </Row>
      <Row className="my-3">
        {problems.map(({ solved, total }, i) => {
          const key = 'ABCDEF'.charAt(i) + (i >= 5 ? '〜' : '');
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
};
