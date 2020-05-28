import React from 'react';
import dataFormat from 'dateformat';
import { DifficultyStars } from '../../components/DifficultyStars';

export const DailyEffortTooltip = ({ active, payload, label }) => {
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
      <table>
        <tbody>
          {payload
            .sort((a, b) => b.dataKey - a.dataKey)
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
