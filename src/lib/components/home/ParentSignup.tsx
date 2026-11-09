'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FieldError, Honeypot } from './FormBits';
import { PARENT_WORDING, validateParentSignup } from '@/lib/forms/parents';
import { suggestEmail } from '@/lib/forms/shared';

/*
The parents' sign-up, shown under the blog post /blog/radixmaths-for-parents. Saves to the
parentSignups collection through /api/parent-signup. See docs/parent-signup.md.
*/
export default function ParentSignup() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // the spam trap, see Honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const clearError = (key: string) =>
    setErrors((current) => {
      if (!current[key]) return current;
      const { [key]: _removed, ...rest } = current;
      return rest;
    });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    const payload = { firstName, email, consent, website };
    const found = validateParentSignup(payload).errors;
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      document.getElementById(`parent-${firstError}`)?.focus();
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/parent-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  if (done) {
    return (
      <div className="rm-form rm-form--done" role="status" id="parent-signup">
        <h2 className="rm-h3">Thank you, you’re signed up</h2>
        <p style={{ margin: 0 }}>
          A confirmation email is on its way to {email.trim()}. If you can’t see it, check
          your junk folder.
        </p>
      </div>
    );
  }

  return (
    <form className="rm-form" id="parent-signup" onSubmit={onSubmit} noValidate>
      <Honeypot value={website} onChange={setWebsite} />

      <fieldset>
        <legend>Get launch updates</legend>
        <p style={{ marginTop: 0 }}>
          We’ll email you when RadixMaths opens, with the early-access price and a free trial.
        </p>

        <div className="rm-field">
          <label className="rm-field__label" htmlFor="parent-firstName">
            Your first name
          </label>
          <input
            className="rm-input"
            id="parent-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
              clearError('firstName');
            }}
            aria-invalid={Boolean(errors.firstName)}
            required
          />
          <FieldError id="parent-firstName" message={errors.firstName} />
        </div>

        <div className="rm-field">
          <label className="rm-field__label" htmlFor="parent-email">
            Your email address
          </label>
          <input
            className="rm-input"
            id="parent-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailSuggestion(null);
              clearError('email');
            }}
            onBlur={() => setEmailSuggestion(suggestEmail(email))}
            aria-invalid={Boolean(errors.email)}
            required
          />
          <FieldError id="parent-email" message={errors.email} />
          {emailSuggestion && (
            <p className="rm-field__hint">
              Did you mean{' '}
              <button
                type="button"
                className="rm-link rm-form__linkbtn"
                onClick={() => {
                  setEmail(emailSuggestion);
                  setEmailSuggestion(null);
                }}
              >
                {emailSuggestion}
              </button>
              ?
            </p>
          )}
        </div>
      </fieldset>

      {/* Unticked by default: the parent has to opt in themselves (PECR). */}
      <label className="rm-consent">
        <input
          id="parent-consent"
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(event) => {
            setConsent(event.target.checked);
            clearError('consent');
          }}
          aria-invalid={Boolean(errors.consent)}
        />
        <span>{PARENT_WORDING}</span>
      </label>
      <FieldError id="parent-consent" message={errors.consent} />

      {formError && (
        <p className="rm-field__error" role="alert">
          {formError} You can also email us at{' '}
          <a className="rm-link" href="mailto:hello@radixmaths.co.uk">hello@radixmaths.co.uk</a>.
        </p>
      )}

      <div className="rm-form__foot">
        <button type="submit" className="rm-btn rm-btn--primary" disabled={sending}>
          {sending ? 'Signing up…' : 'Keep me posted'}
        </button>
        <p className="rm-form__note">
          We’ll only use your email for these updates. See our{' '}
          <Link href="/privacy" className="rm-link">privacy policy</Link>.
        </p>
      </div>
    </form>
  );
}
