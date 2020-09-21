import React from 'react';

interface DifficultyStatisticsDataTooltipPayload {
  value: number;
  dataKey: 'y_line' | 'y_scatter' | 'x';
  stroke: string;
}

interface Props {
  active?: boolean;
  payload?: DifficultyStatisticsDataTooltipPayload[];
  label?: number;
}

export const DifficultyStatisticsDataTooltip: React.FC<Props> = (props) => {
  const { active, payload, label } = props;
  if (
    !active ||
    payload === undefined ||
    payload.length !== 1 ||
    payload[0].dataKey !== 'y_line'
  )
    return <></>;

  return (
    <div
      className="recharts-default-tooltip"
      style={{
        margin: '0px',
        padding: '10px',
        backgroundColor: 'rgb(255, 255, 255)',
        border: '1px solid rgb(204, 204, 204)',
        whiteSpace: 'nowrap',
      }}
    >
      <p className="recharts-tooltip-label" style={{ margin: '0px' }}>
        {`Inner Rating: ${Math.floor(label as number)}`}
      </p>
      <ul
        className="recharts-tooltip-item-list"
        style={{ padding: '0px', margin: '0px' }}
      >
        <li
          className="recharts-tooltip-item"
          style={{
            display: 'block',
            paddingTop: '4px',
            paddingBottom: '4px',
            color: 'rgb(136, 132, 216)',
          }}
        >
          <span className="recharts-tooltip-item-name">Solve Probability</span>
          <span className="recharts-tooltip-item-separator"> : </span>
          <span className="recharts-tooltip-item-value">
            {`${(payload[0].value * 100).toFixed(1)} %`}
          </span>
          <span className="recharts-tooltip-item-unit" />
        </li>
      </ul>
    </div>
  );
};
