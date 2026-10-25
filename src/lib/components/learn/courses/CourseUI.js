'use client';
import Link from 'next/link';
import { Alert, Button } from 'reactstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

/*
Small pieces shared by the learn landing page, the course page and the chapter page
(LearnCourses.js, [content]/page.js, [content]/[lessonContent]/page.js). Styles: "Learn area" in globals.css.
*/

export const percentOf = (completed, total) => (total ? Math.round((completed / total) * 100) : 0);

// the course teal; no path animation (pathTransitionDuration 0)
const RING_STYLES = buildStyles({
  pathColor: '#17a2b8',
  trailColor: '#d8eff3',
  textColor: '#2c2c2c',
  textSize: '1.5rem',
  pathTransitionDuration: 0,
});

// completed / total lessons, or pass `percent` (0-100) and a `label` for anything else (e.g. mastery)
export function ProgressRing({ completed, total, percent, label, className = '' }) {
  const value = percent ?? percentOf(completed, total);
  return (
    <div className={`learn-ring ${className}`} role="img" aria-label={label ?? `${value}% of lessons complete`}>
      <CircularProgressbar value={value} text={`${value}%`} styles={RING_STYLES} />
    </div>
  );
}

export function ProgressBar({ completed, total }) {
  const percent = percentOf(completed, total);
  return (
    <div className="learn-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${percent}% complete`}>
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

const STATUSES = {
  complete: { icon: 'bi-check-circle-fill', label: 'Complete' },
  'in-progress': { icon: 'bi-circle-half', label: 'In progress' },
  todo: { icon: 'bi-circle', label: 'Not started' },
  'coming-soon': { icon: 'bi-hourglass-split', label: 'Coming soon' },
};

export function StatusIcon({ status }) {
  const { icon, label } = STATUSES[status] ?? STATUSES.todo;
  return <i className={`bi ${icon} learn-status learn-status--${status}`} role="img" aria-label={label} />;
}

export const ComingSoon = () => <span className="learn-pill">Coming soon</span>;

// the header panel of the course and chapter pages: title on the left, progress ring + Continue on the right
export function CourseHero({ kicker, title, subtitle, completed, total, next, emptyText }) {
  return (
    <section className="learn-hero">
      <div>
        <p className="learn-hero__kicker">{kicker}</p>
        <h1 className="learn-home__title">{title}</h1>
        {subtitle && <p className="learn-hero__sub">{subtitle}</p>}
      </div>

      {total > 0 ? (
        <div className="learn-hero__progress">
          <ProgressRing completed={completed} total={total} className="learn-hero__ring" />
          <div>
            <p className="learn-course__count">
              {completed} of {total} lessons
            </p>
            <p className="learn-course__note">{completed === total ? 'All done! Keep it fresh with your reviews.' : 'complete'}</p>
            {next && (
              <Button tag={Link} href={next.href} color="info" className="learn-hero__cta">
                {completed > 0 ? 'Continue' : 'Start'}: {next.title} <i className="bi bi-arrow-right" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className="learn-course__note">{emptyText}</p>
      )}
    </section>
  );
}

// loading / error / not found, for pages that load a course outline
export function OutlineState({ isLoading, error }) {
  if (isLoading) return <div className="learn-hero learn-hero--loading" aria-hidden="true" />;
  if (!error) return null;
  const message =
    error.status === 404
      ? 'We couldn’t find that course.'
      : error.status === 403
        ? 'This course isn’t on your account.'
        : 'This course couldn’t be loaded. Refresh the page to try again.';
  return (
    <Alert color={error.status === 404 || error.status === 403 ? 'warning' : 'danger'}>
      {message} <Link href="/learn">Back to your courses</Link>
    </Alert>
  );
}
