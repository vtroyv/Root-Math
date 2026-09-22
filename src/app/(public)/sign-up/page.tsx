'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignUp , } from '@clerk/nextjs';
import { useCreateUserMutation } from '@/lib/redux/slices/apiSlice';
import AuthShell from '@/lib/components/home/AuthShell';

const Signup = () => {
  // Clerk states
  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();
  const [addNewUser, mutationState] = useCreateUserMutation()

  // Form fields
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [examBoard, setExamBoard] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [year, setYear] = useState('');
  const [school, setSchool] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');

  const onDismiss = () => setAlertVisible(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoaded) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setAlertVisible(true);
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        // Store extra info in public or unsafe metadata
        // 'publicMetadata' is typically recommended unless you need it private
        unsafeMetadata: {
          examBoard,
          year,
          school,
        },
      });

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setVerifying(true);
    } catch (err: any) {
      console.error('SignUp Error:', JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.longMessage || 'Error signing up');
      setAlertVisible(true);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLoaded) return;

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (attempt.status === 'complete') {
        // Once the user is verified, set session as active and redirect

        //Also note at this point it's safe to create the the data to put in mongoDB for the user, because if the user doesn't doesn't successfully verify
        //e.g. unless attempt.status === 'complete', this block won't run, so were safe to add the user to the DB now.
        //Lol thinking about it shouldn't we create another if (attempt.status === 'complete'statement first above this and add to the DB here, because if mongoDB, doesn't add to the DB,
        //we won't want clerkJS to still create the user)

        //This is the point where we will want to add a users credentials to the database:



        await setActive({ session: attempt.createdSessionId });
        console.log('The signUp object is now ', signUp)
        const {id, firstName, lastName, emailAddress, unsafeMetadata}= signUp
        const {school, year, examBoard} = unsafeMetadata
        //Use this to populate the userDatabase in MongoDB
        const userData = {id, firstName, lastName, emailAddress, school, year, examBoard}


        try {
          const result = await addNewUser(userData)
          console.log('The result from the nextjs API is ', result )

        }catch(error) {
          console.log('Couldn\'t add user to the mongoDB database')
        }




        router.push('/learn');
      } else {
        // User may need to complete more steps
        console.error('Verification incomplete:', JSON.stringify(attempt, null, 2));
      }
    } catch (err: any) {
      console.error('Verification Error:', JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.longMessage || 'Error verifying code');
      setAlertVisible(true);
    }
  };

  // The same error strip on both steps.
  const errorAlert = error && alertVisible && (
    <div className="rm-alert" role="alert">
      <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
      {error}
      <button type="button" aria-label="Dismiss" onClick={onDismiss}>
        <i className="bi bi-x-lg" aria-hidden="true" />
      </button>
    </div>
  );

  // --- Show Verification Form (STEP 2) ---
  if (verifying) {
    return (
      <AuthShell
        title="Check your email"
        intro={`We have sent a six-digit code to ${emailAddress || 'your inbox'}. Enter it below to finish setting up your account.`}
      >
        <form className="rm-form" onSubmit={handleVerifyCode}>
          {errorAlert}

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="code">
              Verification code
            </label>
            <input
              className="rm-input"
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <p className="rm-field__hint">
              It can take a minute to arrive — check your spam folder if it does not.
            </p>
          </div>

          <div style={{ marginTop: '1.75rem' }}>
            <button
              type="submit"
              className="rm-btn rm-btn--primary rm-btn--lg"
              style={{ width: '100%' }}
            >
              Verify and continue
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  // --- Show Sign-Up Form (STEP 1) ---
  return (
    <AuthShell
      wide
      title="Create your account"
      intro="Tell us what you are studying and we will set the course up around it."
      alt={
        <>
          Already have an account? <Link href="/sign-in">Log in</Link>
        </>
      }
    >
      <form className="rm-form" onSubmit={handleSubmit}>
        {errorAlert}

        <fieldset>
          <legend>About you</legend>

          <div className="rm-form__row">
            <div className="rm-field">
              <label className="rm-field__label" htmlFor="firstName">
                First name
              </label>
              <input
                className="rm-input"
                id="firstName"
                placeholder="Ada"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="rm-field">
              <label className="rm-field__label" htmlFor="lastName">
                Last name
              </label>
              <input
                className="rm-input"
                id="lastName"
                placeholder="Lovelace"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="email">
              Email address
            </label>
            <input
              className="rm-input"
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ada@example.com"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Your studies</legend>

          <div className="rm-form__row">
            <div className="rm-field">
              <label className="rm-field__label" htmlFor="yearGroup">
                Year
              </label>
              <select
                className="rm-input"
                id="yearGroup"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Choose your year</option>
                <option value="12">Year 12</option>
                <option value="13">Year 13</option>
              </select>
            </div>

            <div className="rm-field">
              <label className="rm-field__label" htmlFor="examBoard">
                Exam board
              </label>
              <select
                className="rm-input"
                id="examBoard"
                value={examBoard}
                onChange={(e) => setExamBoard(e.target.value)}
                required
              >
                <option value="">Choose your board</option>
                <option value="edexcel">Edexcel</option>
                <option value="ocr">OCR</option>
                <option value="aqa">AQA</option>
                <option value="cambridge-international">Cambridge International</option>
              </select>
            </div>
          </div>

          <div className="rm-field">
            <label className="rm-field__label" htmlFor="school">
              School, sixth form or college <span>(optional)</span>
            </label>
            <input
              className="rm-input"
              id="school"
              type="text"
              placeholder="Hills Road Sixth Form College"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Your password</legend>

          <div className="rm-form__row">
            <div className="rm-field">
              <label className="rm-field__label" htmlFor="password">
                Password
              </label>
              <input
                className="rm-input"
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="rm-field">
              <label className="rm-field__label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <input
                className="rm-input"
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Type it again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Clerk mounts its bot-protection widget here — it has to stay. */}
        <div id="clerk-captcha"></div>

        <div style={{ marginTop: '1.75rem' }}>
          <button
            type="submit"
            className="rm-btn rm-btn--primary rm-btn--lg"
            style={{ width: '100%' }}
            disabled={!isLoaded}
          >
            Continue
          </button>
        </div>
      </form>
    </AuthShell>
  );
};

export default Signup;
