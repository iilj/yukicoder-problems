import React from 'react';
import {
  PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend,
} from 'recharts';

export const SinglePieChart = ({ data }) => (
  <div>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie dataKey="value" data={data} outerRadius="80%" fill="#ff0000">
          {data.map((e) => (
            <Cell key={e.name} fill={e.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
