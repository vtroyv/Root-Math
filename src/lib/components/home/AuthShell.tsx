// Shared frame for /sign-in and /sign-up: a flat teal ground with chalked
// maths behind a paper card. Presentational only — each page keeps its own
// Clerk logic and passes the form in as children.
import React from 'react';

/* Hard-coded positions rather than randomised ones, so the server and client
   render the same thing. Hidden below 900px by .rm-authpage__symbols. */
const chalkedSymbols = [
  { text: '∫ x² dx', top: '8%', left: '6%', size: 2.3, rotate: -8 },
  { text: 'dy/dx', top: '17%', left: '82%', size: 2.6, rotate: 9 },
  { text: '√2', top: '33%', left: '11%', size: 2, rotate: -13 },
  { text: 'eˣ', top: '30%', left: '89%', size: 2.4, rotate: -5 },
  { text: "f′(x)", top: '55%', left: '5%', size: 2, rotate: -4 },
  { text: '∑ aₙ', top: '58%', left: '86%', size: 2, rotate: -7 },
  { text: 'π', top: '76%', left: '13%', size: 2.7, rotate: -11 },
  { text: 'lim f(x)', top: '82%', left: '80%', size: 1.8, rotate: 8 },
];

type AuthShellProps = {
  title: string;
  intro: string;
  children: React.ReactNode;
  /** The "no account yet?" line under the card. */
  alt?: React.ReactNode;
  /** Sign-up asks for far more than sign-in, so it takes the wider column. */
  wide?: boolean;
};

export default function AuthShell({
  title,
  intro,
  children,
  alt,
  wide = false,
}: AuthShellProps) {
  return (
    <div className="rm-landing">
      <div className="rm-authpage">
        <div className="rm-authpage__symbols" aria-hidden="true">
          {chalkedSymbols.map((symbol) => (
            <span
              key={symbol.text}
              style={{
                top: symbol.top,
                left: symbol.left,
                fontSize: `${symbol.size}rem`,
                '--rm-symbol-rotate': `${symbol.rotate}deg`,
              } as React.CSSProperties}
            >
              {symbol.text}
            </span>
          ))}
        </div>

        <div className={`rm-auth${wide ? ' rm-auth--wide' : ''}`}>
          <div className="rm-auth__head">
            <h1 className="rm-h2">{title}</h1>
            <p>{intro}</p>
          </div>

          {children}

          {alt && <p className="rm-auth__alt">{alt}</p>}
        </div>
      </div>
    </div>
  );
}
