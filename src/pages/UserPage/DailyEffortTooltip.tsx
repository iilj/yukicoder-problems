import React from 'react';
import dataFormat from 'dateformat';
import { DifficultyStars } from '../../components/DifficultyStars';

export const DailyEffortTooltip = ({
  active, payload, label, reverseColorOrder,
}) => {
  if (!active) return null;
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
        {dataFormat(new Date(Number(label)), 'yyyy/mm/dd')}
      </p>
      <ul className="recharts-tooltip-item-list" style={{ padding: '0px', margin: '0px' }}>
        <li
          className="recharts-tooltip-item"
          style={{
            display: 'block',
            paddingTop: '4px',
            paddingBottom: '4px',
            color: 'rgb(136, 132, 216)',
          }}
        >
          <span className="recharts-tooltip-item-name">count</span>
          <span className="recharts-tooltip-item-separator"> : </span>
          <span className="recharts-tooltip-item-value">
            {payload.reduce((acc, entry) => acc + entry.value, 0)}
          </span>
          <span className="recharts-tooltip-item-unit" />
        </li>
      </ul>
      <table>
        <tbody>
          {payload
            .sort((a, b) => (reverseColorOrder ? a.dataKey - b.dataKey : b.dataKey - a.dataKey))
            .map((entry) => {
              if (entry.value <= 0) return null;
              return (
                <tr style={{ color: entry.stroke }} key={entry.dataKey}>
                  <td align="right">{entry.value}</td>
                  <td>{' * '}</td>
                  <td>
                    <DifficultyStars level={entry.dataKey} showDifficultyLevel />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
