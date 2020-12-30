/* eslint react/jsx-no-target-blank: 0 */
import React from 'react';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const NewTabLink: React.FC<Props> = (props) => (
  <a
    href={props.href}
    target="_blank"
    rel="noopener"
    className={props.className}
    title={props.title}
    id={props.id}
  >
    {props.children}
  </a>
);
