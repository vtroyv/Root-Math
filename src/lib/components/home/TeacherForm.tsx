// components/TeacherForm.tsx — the request form on /teachers. How it works: docs/teachers-page.md.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FieldError, Honeypot } from './FormBits';
import { BOARDS, RESOURCES, ROLES, UPDATES_WORDING, validateTeacherRequest } from '@/lib/forms/teachers';
import { suggestEmail } from '@/lib/forms/shared';

const contactEmail = 'hello@radixmaths.co.uk';

const emptyForm = {
  name: '',
  email: '',
  role: '',
  school: '',
  board: '',
  resource: '',
  topic: '',
  problem: '',
  wantsWorkshop: false,
  wantsClassTrial: false,
  wantsChat: false,
  wantsUpdates: false,
};
type FormState = typeof emptyForm;

export default function TeacherForm() {
  const [form, setForm] = useState(emptyForm);
  const [website, setWebsite] = useState(''); // the spam trap, see Honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const { [key]: _removed, ...rest } = current;
      return rest;
    });
  };

  // Choosing a resource or ticking a box can answer the "tell us what you'd like" error shown
  // under the problem field.
  const clearProblemError = () => {
    setErrors((current) => {
      const { problem: _removed, ...rest } = current;
      return rest;
    });
  };

  const onEmailBlur = () => {
    setEmailSuggestion(suggestEmail(form.email));
    const message = form.email ? validateTeacherRequest(form).errors.email : undefined;
    setErrors((current) => {
      const { email: _removed, ...rest } = current;
      return message ? { ...rest, email: message } : rest;
    });
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const found = validateTeacherRequest(form).errors;
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/teacher-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) setDone(true);
      else if (result.errors) setErrors(result.errors);
      else setFormError(result.error ?? 'Something went wrong.');
    } catch {
      setFormError('We couldn’t reach the server. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  const sendAnother = () => {
    setForm(emptyForm);
    setErrors({});
    setEmailSuggestion(null);
    setDone(false);
  };

  if (done) {
    return (
      <div className="rm-form rm-form--wide rm-form--done" role="status">
        <span className="rm-card__icon" aria-hidden="true">
          <i className="bi bi-patch-check-fill" />
        </span>
        <h3 className="rm-h3">Thank you, we have received your request</h3>
        <p className="rm-lead">You’ll usually hear from us within 2 working days.</p>
        <div className="rm-btn-row">
          <Link href="/" className="rm-btn rm-btn--primary">
            Back to home
          </Link>
          <button type="button" className="rm-btn rm-btn--ghost" onClick={sendAnother}>
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="rm-form rm-form--wide" onSubmit={onSubmit} noValidate>
      <Honeypot value={website} onChange={setWebsite} />

      <fieldset>
        <legend>Tell us what you need</legend>

        <div className="rm-form__fields">
          <div className="rm-field">
            <label className="rm-field__label" htmlFor="name">
              Your name
            </label>
            <input
              className="rm-input"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Scott Clarke"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              required
            />
            <FieldError id="name" message={errors.name} />
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="email">
              Work email
            </label>
            <input
              className="rm-input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="s.clarke@yourschool.sch.uk"
              value={form.email}
              onChange={(event) => {
                setField('email', event.target.value);
                setEmailSuggestion(null);
              }}
              onBlur={onEmailBlur}
              aria-invalid={Boolean(errors.email)}
              required
            />
            <FieldError id="email" message={errors.email} />
            {emailSuggestion && (
              <p className="rm-field__hint">
                Did you mean{' '}
                <button
                  type="button"
                  className="rm-link rm-form__linkbtn"
                  onClick={() => {
                    setField('email', emailSuggestion);
                    setEmailSuggestion(null);
                  }}
                >
                  {emailSuggestion}
                </button>
                ?
              </p>
            )}
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="role">
              Your role
            </label>
            <select
              className="rm-input"
              id="role"
              name="role"
              value={form.role}
              onChange={(event) => setField('role', event.target.value)}
              aria-invalid={Boolean(errors.role)}
              required
            >
              <option value="" disabled>
                Choose your role
              </option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <FieldError id="role" message={errors.role} />
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="school">
              School, college or organisation
            </label>
            <input
              className="rm-input"
              id="school"
              name="school"
              type="text"
              autoComplete="organization"
              placeholder="Hawkins High School"
              value={form.school}
              onChange={(event) => setField('school', event.target.value)}
              aria-invalid={Boolean(errors.school)}
              required
            />
            <FieldError id="school" message={errors.school} />
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="board">
              A Level exam board
            </label>
            <select
              className="rm-input"
              id="board"
              name="board"
              value={form.board}
              onChange={(event) => setField('board', event.target.value)}
              aria-invalid={Boolean(errors.board)}
              required
            >
              <option value="" disabled>
                Choose your exam board
              </option>
              {BOARDS.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
            <FieldError id="board" message={errors.board} />
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="resource">
              Free resource <span>(one per request)</span>
            </label>
            <select
              className="rm-input"
              id="resource"
              name="resource"
              value={form.resource}
              onChange={(event) => {
                setField('resource', event.target.value);
                clearProblemError();
              }}
            >
              <option value="">No resource for now</option>
              {RESOURCES.map((resource) => (
                <option key={resource} value={resource}>
                  {resource}
                </option>
              ))}
            </select>
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="topic">
              What should it cover?
            </label>
            <input
              className="rm-input"
              id="topic"
              name="topic"
              type="text"
              placeholder="Year 12 binomial expansion"
              value={form.topic}
              onChange={(event) => setField('topic', event.target.value)}
              aria-invalid={Boolean(errors.topic)}
            />
            <FieldError id="topic" message={errors.topic} />
            <p className="rm-field__hint">Needed if you chose a resource.</p>
          </div>

          <div className="rm-field rm-field--wide">
            <label className="rm-field__label" htmlFor="problem">
              What’s your biggest problem teaching A Level Maths right now? <span>(optional)</span>
            </label>
            <textarea
              className="rm-input"
              id="problem"
              name="problem"
              rows={3}
              placeholder="For example, knowing whether homework is really a student’s own work."
              value={form.problem}
              onChange={(event) => setField('problem', event.target.value)}
              aria-invalid={Boolean(errors.problem)}
            />
            <FieldError id="problem" message={errors.problem} />
          </div>
        </div>
      </fieldset>

      <div className="rm-form__ticks">
        <label className="rm-consent">
          <input
            type="checkbox"
            name="wantsWorkshop"
            checked={form.wantsWorkshop}
            onChange={(event) => {
              setField('wantsWorkshop', event.target.checked);
              clearProblemError();
            }}
          />
          <span>I’d be interested in a free maths workshop for students at my school.</span>
        </label>

        <label className="rm-consent">
          <input
            type="checkbox"
            name="wantsClassTrial"
            checked={form.wantsClassTrial}
            onChange={(event) => {
              setField('wantsClassTrial', event.target.checked);
              clearProblemError();
            }}
          />
          <span>I’d be interested in trying RadixMaths with one class.</span>
        </label>

        <label className="rm-consent">
          <input
            type="checkbox"
            name="wantsChat"
            checked={form.wantsChat}
            onChange={(event) => {
              setField('wantsChat', event.target.checked);
              clearProblemError();
            }}
          />
          <span>I’m happy to have a 20-minute chat about what would help.</span>
        </label>

        {/* Unticked by default, and stored with its wording, like the register form's opt-in. */}
        <label className="rm-consent">
          <input
            type="checkbox"
            name="wantsUpdates"
            checked={form.wantsUpdates}
            onChange={(event) => {
              setField('wantsUpdates', event.target.checked);
              clearProblemError();
            }}
          />
          <span>{UPDATES_WORDING}</span>
        </label>
      </div>

      {formError && (
        <p className="rm-field__error" role="alert">
          {formError} You can also email us at{' '}
          <a className="rm-link" href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      )}

      <div className="rm-form__foot">
        <button type="submit" className="rm-btn rm-btn--primary rm-btn--lg" disabled={sending}>
          {sending ? 'Sending…' : 'Send request'}
        </button>
        <p className="rm-form__note">
          <i className="bi bi-clock-fill" /> We usually reply within 2 working days.
        </p>
      </div>
    </form>
  );
}
