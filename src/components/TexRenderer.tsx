import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface Props {
  text: string;
}

export const TexRenderer: React.FC<Props> = (props) => {
  const { text } = props;
  const parts = text.split(/(\$.*?\$)/g).filter(Boolean);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return (
            <InlineMath
              key={index}
              math={math}
              renderError={(error) => (
                <span style={{ color: 'red' }}>
                  Error: {math}: {error}
                </span> // エラー時の表示
              )}
            />
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </span>
  );
};
