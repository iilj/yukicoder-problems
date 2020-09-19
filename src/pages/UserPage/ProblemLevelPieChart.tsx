import React from 'react';
import { Row, Col } from 'reactstrap';
import { getLevelList, getDifficultyLevelColor } from '../../utils';
import { SinglePieChart } from '../../components/SinglePieChart';
import { DifficultyStars } from '../../components/DifficultyStars';
import { Problem, ProblemLevel } from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';

interface Props {
  problems: Problem[];
  solvedProblems: SolvedProblem[];
}

export const ProblemLevelPieChart: React.FC<Props> = (props) => {
  const { problems, solvedProblems } = props;
  const levelList = getLevelList();

  const colorCount = problems.reduce(
    (map, problem) =>
      map.set(problem.Level, (map.get(problem.Level) as number) + 1),
    levelList.reduce(
      (map, level) => map.set(level, 0),
      new Map<ProblemLevel, number>()
    )
  );

  const solvedCount = solvedProblems.reduce(
    (map, solvedProblem) =>
      map.set(
        solvedProblem.Level,
        (map.get(solvedProblem.Level) as number) + 1
      ),
    levelList.reduce(
      (map, level) => map.set(level, 0),
      new Map<ProblemLevel, number>()
    )
  );

  const data = levelList.map((level) => {
    const totalCount = colorCount.get(level) ?? 0;
    const solved = solvedCount.get(level) ?? 0;
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
                <DifficultyStars
                  level={e.level}
                  showDifficultyLevel={true}
                  color={true}
                />
              </h5>
              <h5 className="text-muted">{`${e.solved} / ${e.totalCount}`}</h5>
            </Col>
          ))}
      </Row>
    </div>
  );
};
