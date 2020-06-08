import React from 'react';
import { Row, Col } from 'reactstrap';
import { getLevelList, getDifficultyLevelColor } from '../../utils';
import { SinglePieChart } from '../../components/SinglePieChart';
import { DifficultyStars } from '../../components/DifficultyStars';

export const ProblemLevelPieChart = (props) => {
  const { problems, solvedProblems } = props;
  const levelList = getLevelList();

  const colorCount = problems.reduce(
    (map, problem) => {
      map[problem.Level ?? 0]++;
      return map;
    },
    levelList.reduce((map, level) => {
      map[level] = 0;
      return map;
    }, {}),
  );

  const solvedCount = solvedProblems.reduce(
    (map, solvedProblem) => {
      map[solvedProblem.Level ?? 0]++;
      return map;
    },
    levelList.reduce((map, level) => {
      map[level] = 0;
      return map;
    }, {}),
  );

  const data = levelList.map((level) => {
    const totalCount = colorCount[level];
    const solved = solvedCount[level];
    const color = getDifficultyLevelColor(level);
    return {
      color,
      totalCount,
      solved,
      level,
    };
  });

  return (
    <div>
      <Row className="my-3">
        {data
          .filter((e) => e.totalCount > 0)
          .map((e) => (
            <Col key={e.level} className="text-center" xs="6" md="2">
              <SinglePieChart
                data={[
                  { name: 'Accepted', color: e.color, value: e.solved },
                  {
                    name: 'Trying',
                    color: '#58616a',
                    value: e.totalCount - e.solved,
                  },
                ]}
              />
              <h5 style={{ color: e.color, fontSize: 'small' }}>
                {'Level '}
                {e.level.toFixed(1)}
                <DifficultyStars level={e.level} showDifficultyLevel />
              </h5>
              <h5 className="text-muted">{`${e.solved} / ${e.totalCount}`}</h5>
            </Col>
          ))}
      </Row>
    </div>
  );
};
