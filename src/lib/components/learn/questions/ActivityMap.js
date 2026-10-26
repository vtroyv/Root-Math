'use client';
import { useState } from 'react';
import { Alert, Button, Input, Label } from 'reactstrap';
import { useUser } from '@clerk/nextjs';
import { useGetActivityQuery } from '@/lib/redux/slices/apiSlice';
import { GOALS, cleanGoal, goalScore, goalsFor, monthGrid, shade, shiftMonth } from '@/lib/activity/goals';
import { localToday } from '@/lib/reviews/localDay';

/*
The Questions page's activity map: a month of days, each shaded by how much of the student's daily
goals they met (questions, review cards, study time; src/lib/activity/goals.js). Click a day for its
numbers. Goals are edited here and saved to Clerk unsafeMetadata.dailyGoals.
Data: GET /api/activity for the month shown.
*/

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHADE_TEXT = ['no activity', 'some of your goals', 'about half your goals', 'most of your goals', 'every goal met'];

// '2026-10-25' -> 'Sunday 25 October'; '2026-10' -> 'October 2026'
const dayName = (day) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
const monthName = (month) => new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function ActivityMap() {
  const { user } = useUser();
  const goals = goalsFor(user);
  const [today] = useState(localToday);
  const thisMonth = today.slice(0, 7);
  const [month, setMonth] = useState(thisMonth);
  const [picked, setPicked] = useState(today);
  const [editing, setEditing] = useState(false);

  const { from, to, cells } = monthGrid(month);
  // currentData: this month's days only (data would briefly show the month before)
  const { currentData, error } = useGetActivityQuery({ from, to }, { refetchOnMountOrArgChange: true });
  const byDay = new Map((currentData ?? []).map((d) => [d.day, d]));

  const pastDays = cells.filter((d) => d && d <= today);
  const goalDays = pastDays.filter((d) => goalScore(byDay.get(d), goals) >= 1).length;
  const activeDays = pastDays.filter((d) => byDay.has(d)).length;

  const showMonth = (next) => {
    setMonth(next);
    setPicked(next === thisMonth ? today : null);
  };

  return (
    <section className="learn-topic">
      <div className="learn-topic__head">
        <h2 className="learn-topic__name">
          <i className="bi bi-calendar3" aria-hidden="true" /> Activity
        </h2>
      </div>
      <div className="learn-panel__body">
        <div className="learn-activity__nav">
          <Button size="sm" color="secondary" outline onClick={() => showMonth(shiftMonth(month, -1))} aria-label="Previous month">
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </Button>
          <strong aria-live="polite">{monthName(month)}</strong>
          <span className="learn-activity__nav-end">
            {month !== thisMonth && (
              <Button size="sm" color="link" onClick={() => showMonth(thisMonth)}>
                Today
              </Button>
            )}
            <Button size="sm" color="secondary" outline onClick={() => showMonth(shiftMonth(month, 1))} disabled={month >= thisMonth} aria-label="Next month">
              <i className="bi bi-chevron-right" aria-hidden="true" />
            </Button>
          </span>
        </div>

        {error && !currentData && (
          <Alert color="danger" fade={false}>
            Your activity couldn&apos;t be loaded.
          </Alert>
        )}

        <div className="learn-activity__grid">
          {WEEKDAYS.map((w) => (
            <span key={w} className="learn-activity__weekday" aria-hidden="true">
              {w}
            </span>
          ))}
          {cells.map((day, i) => {
            if (!day) return <span key={`blank-${i}`} />;
            const level = day <= today ? shade(goalScore(byDay.get(day), goals)) : 0;
            return (
              <button
                key={day}
                type="button"
                className={`learn-activity__day learn-activity__day--${level}${day === today ? ' learn-activity__day--today' : ''}`}
                aria-pressed={day === picked}
                aria-label={`${dayName(day)}${day === today ? ' (today)' : ''}: ${day > today ? 'still to come' : SHADE_TEXT[level]}`}
                disabled={day > today}
                onClick={() => setPicked(day)}
              >
                {Number(day.slice(8))}
              </button>
            );
          })}
        </div>

        <div className="learn-activity__legend" aria-hidden="true">
          Less
          {SHADE_TEXT.map((_, level) => (
            <span key={level} className={`learn-activity__day learn-activity__day--${level}`} />
          ))}
          More
        </div>

        <p className="learn-progress__meta">
          {month === thisMonth ? 'This month' : monthName(month)}: every goal met on {plural(goalDays, 'day')} · active on {plural(activeDays, 'day')}
        </p>

        {picked && <DayDetail day={picked} isToday={picked === today} activity={byDay.get(picked)} goals={goals} />}

        {editing ? (
          <GoalsForm user={user} goals={goals} onDone={() => setEditing(false)} />
        ) : (
          <p className="learn-progress__covers">
            Daily goals: {goalSummary(goals)}{' '}
            <Button color="link" size="sm" className="learn-questions__inline" onClick={() => setEditing(true)}>
              Edit goals
            </Button>
          </p>
        )}
      </div>
    </section>
  );
}

function DayDetail({ day, isToday, activity, goals }) {
  const met = goalScore(activity, goals) >= 1;
  return (
    <div className="learn-callout">
      <strong>{isToday ? `Today, ${dayName(day)}` : dayName(day)}</strong>
      {met && <span className="learn-pill learn-activity__met">Goals met</span>}
      <ul className="learn-activity__facts">
        {GOALS.map((g) => (
          <li key={g.id}>
            {g.label}: {activity?.[g.id] ?? 0}
            {goals[g.id] > 0 ? ` / ${goals[g.id]}` : ''} {g.unit}
          </li>
        ))}
        <li>Lessons finished: {activity?.lessons ?? 0}</li>
      </ul>
    </div>
  );
}

function GoalsForm({ user, goals, onDone }) {
  const [values, setValues] = useState(goals);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const dailyGoals = Object.fromEntries(GOALS.map((g) => [g.id, cleanGoal(values[g.id], g)]));
      // unsafeMetadata is replaced as a whole, so keep what's already there (e.g. examBoard)
      await user.update({ unsafeMetadata: { ...user.unsafeMetadata, dailyGoals } });
      onDone();
    } catch (err) {
      console.error('Saving goals failed:', err);
      setError('Your goals couldn’t be saved. Try again.');
      setSaving(false);
    }
  };

  return (
    <form className="learn-activity__goals" onSubmit={save}>
      <p className="learn-progress__covers">Set a goal to 0 to switch it off.</p>
      {GOALS.map((g) => (
        <div key={g.id} className="learn-activity__goal">
          <Label for={`goal-${g.id}`}>
            {g.label} ({g.unit} a day)
          </Label>
          <Input
            id={`goal-${g.id}`}
            type="number"
            min={0}
            max={g.max}
            value={values[g.id]}
            onChange={(e) => setValues((v) => ({ ...v, [g.id]: e.target.value }))}
          />
        </div>
      ))}
      {error && <p className="learn-progress__meta">{error}</p>}
      <div className="learn-activity__goal-buttons">
        <Button type="submit" color="info" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save goals'}
        </Button>
        <Button type="button" color="secondary" outline size="sm" onClick={onDone} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// "3 questions · 10 cards · 20 min", leaving out goals that are off
function goalSummary(goals) {
  const on = GOALS.filter((g) => goals[g.id] > 0);
  return on.length ? on.map((g) => `${goals[g.id]} ${g.unit}`).join(' · ') : 'none set';
}

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`;
