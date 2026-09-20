"use client";
import React, { useState, useEffect } from 'react';
import { useSignIn, useAuth } from "@clerk/nextjs";
import { Form, Input, Label, Button, Badge } from 'reactstrap'
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Login() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // If user is already logged in, immediately redirect
  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.push('/learn');
    }
  }, [isAuthLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <>
      <h1>
        Welcome to <Badge color="info">Root Math</Badge>
      </h1>
      <br />
      <br />
      <h3>
        Don&apos;t have an account? 
        <Link className="router-link" href="/sign-up">
          Sign Up
        </Link>
      </h3>
      <br />
      <Form onSubmit={handleSubmit}>
        <Label for="userEmail">Email</Label>
        <Input
          type="email"
          name="userEmail"
          value={email}
          placeholder="Enter Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <Label for="userPassword">Password</Label>
        <Input
          type="password"
          name="userPassword"
          value={password}
          placeholder="Create Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          active
          block
          color="info"
          size="lg"
          style={{ marginTop: '2rem' }}
        >
          Login
        </Button>
      </Form>
    </>
  );
}
