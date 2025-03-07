'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Form, Label, Input, Button, Badge, Alert, Row, Col } from 'reactstrap';
import { useSignUp , } from '@clerk/nextjs';
import { useCreateUserMutation } from '@/lib/redux/slices/apiSlice';

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

  // --- Show Verification Form (STEP 2) ---
  if (verifying) {
    return (
      <>
        <h1>Verify your email</h1>
        {error && (
          <Alert color="danger" isOpen={alertVisible} toggle={onDismiss}>
            {error}
          </Alert>
        )}
        <Form onSubmit={handleVerifyCode}>
          <Label for="code">Enter your verification code</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Button color="info" size="lg" style={{ marginTop: '2rem' }} outline>
            Verify
          </Button>
        </Form>
      </>
    );
  }

  // --- Show Sign-Up Form (STEP 1) ---
  return (
    <>
      <h1>
        <Badge color="info">Welcome to Root Math Where Maths is Fun</Badge>
      </h1>
      <br />
      <h3>
        Do you already have an account? <Link href="/login">Login</Link>
      </h3>

      {error && (
        <Alert color="danger" isOpen={alertVisible} toggle={onDismiss}>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="row-cols-lg-auto g-3 align-items-center">
          <Col>
            <Label for="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Col>

          <Col>
            <Label for="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Col>

          <Col>
            <Label for="yearGroup">Year</Label>
            <Input
              id="yearGroup"
              type="select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="">--select year--</option>
              <option value="12">Year 12</option>
              <option value="13">Year 13</option>
            </Input>
          </Col>
        </Row>

        <br />

        <Label for="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter Email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />

        <br />

        <Label for="examBoard">Exam Board</Label>
        <Input
          id="examBoard"
          type="select"
          value={examBoard}
          onChange={(e) => setExamBoard(e.target.value)}
          required
        >
          <option value="">--select exam board--</option>
          <option value="edexcel">Edexcel</option>
          <option value="ocr">OCR</option>
          <option value="aqa">AQA</option>
          <option value="cambridge-international">Cambridge International</option>
        </Input>

        <br />

        <Label for="school">School</Label>
        <Input
          id="school"
          type="text"
          placeholder="Your school name"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />

        <br />

        <Label for="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />

        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div id="clerk-captcha"></div>

        <Button color="info" size="lg" style={{ marginTop: '2rem' }} outline>
          Continue
        </Button>
      </Form>
    </>
  );
};

export default Signup;
