"use client";
import React, { useState, useEffect } from 'react';
import { useSignIn, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import AuthShell from '@/lib/components/home/AuthShell';

export default function Login() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // If user is already logged in, immediately redirect
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.push('/learn');
    }
  }, [isAuthLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSignInLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/learn');
      } else {
        // If sign-in is not complete, you may need
        // to handle the subsequent steps.
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.longMessage || 'We could not sign you in. Check your email and password.');
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      intro="Sign in and pick up where you left off."
      alt={
        <>
          No account yet? <Link href="/sign-up">Create one</Link>
        </>
      }
    >
      <form className="rm-form" onSubmit={handleSubmit}>
        {error && (
          <div className="rm-alert" role="alert">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
            {error}
            <button type="button" aria-label="Dismiss" onClick={() => setError('')}>
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="rm-field">
          <label className="rm-field__label" htmlFor="userEmail">
            Email address
          </label>
          <input
            className="rm-input"
            id="userEmail"
            name="userEmail"
            type="email"
            autoComplete="email"
            placeholder="ada@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="rm-field">
          <label className="rm-field__label" htmlFor="userPassword">
            Password
          </label>
          <input
            className="rm-input"
            id="userPassword"
            name="userPassword"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {/* Plain spacing rather than .rm-form__foot — its dashed rule only
            makes sense when there is a note sitting beside the button. */}
        <div style={{ marginTop: '1.75rem' }}>
          <button
            type="submit"
            className="rm-btn rm-btn--primary rm-btn--lg"
            style={{ width: '100%' }}
            disabled={!isSignInLoaded}
          >
            Log in
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
