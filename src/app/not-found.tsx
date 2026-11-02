import Link from "next/link";
import Navigation from "@/lib/components/home/Navigation";
import Footer from "@/lib/components/home/Footer";

/*
The site-wide 404, shown for any URL that doesn't match a route. It sits outside the
(public) layout, so it brings its own nav and footer. Built entirely from the landing
hero's classes (squared-paper grid, margin doodles, centred copy), so no new CSS.
Positions are hard-coded, like the hero's, so server and client render the same.
*/
const symbols = [
  { text: "1 ÷ 0", top: "12%", left: "6%", size: 2.4, rotate: -8 },
  { text: "√−1", top: "22%", left: "84%", size: 2.2, rotate: 10 },
  { text: "∞", top: "52%", left: "4%", size: 2.4, rotate: -10 },
  { text: "tan 90°", top: "58%", left: "86%", size: 1.9, rotate: 7 },
  { text: "0⁰", top: "82%", left: "14%", size: 2.1, rotate: 6 },
  { text: "ln 0", top: "80%", left: "76%", size: 2, rotate: -6 },
];

export default function NotFound() {
  return (
    <>
      <Navigation />
      <div className="rm-landing">
        <header
          className="rm-hero"
          style={{ minHeight: "calc(100vh - 4.6rem)", display: "grid", alignContent: "center" }}
        >
          <div className="rm-hero__symbols" aria-hidden="true">
            {symbols.map((symbol) => (
              <span
                key={symbol.text}
                style={
                  {
                    top: symbol.top,
                    left: symbol.left,
                    fontSize: `${symbol.size}rem`,
                    "--rm-symbol-rotate": `${symbol.rotate}deg`,
                  } as React.CSSProperties
                }
              >
                {symbol.text}
              </span>
            ))}
          </div>

          <div className="rm-container rm-hero__grid">
            <div className="rm-hero__copy">
              <span className="rm-eyebrow">
                <i className="bi bi-signpost-split-fill" /> Error 404
              </span>

              <h1 className="rm-display">
                This page is <span className="rm-underline">undefined</span>
              </h1>

              <p className="rm-lead">
                Like dividing by zero, the page you&apos;re looking for doesn&apos;t exist. It
                may have moved, or there might be a typo in the link.
              </p>

              <div className="rm-btn-row">
                <Link href="/" className="rm-btn rm-btn--primary rm-btn--lg">
                  <i className="bi bi-house-door-fill" /> Back to home
                </Link>
                <Link href="/courses" className="rm-btn rm-btn--ghost rm-btn--lg">
                  Browse courses
                </Link>
              </div>
            </div>
          </div>
        </header>
        <Footer />
      </div>
    </>
  );
}
