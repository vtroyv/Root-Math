"use client";
import React from "react";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Button,
  CardBody,
  Card,
} from "reactstrap";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// A simple skeleton component for placeholders
function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        height: "200px",
        borderRadius: "8px",
        marginBottom: "1.5rem",
      }}
    />
  );
}

export default function LearnCourses() {

  /*
  You may have to add a simple dictionary to contain different links e.g. if a CIE user logs in
  */
  const { isLoaded, isSignedIn, user } = useUser();

  // 1) While Clerk is still loading, show our skeleton screen
  if (!isLoaded) {
    return (
      <div className="learn-courses-skeleton">
        <h2 style={{ marginBottom: "1rem" }}>Loading your courses...</h2>
        <Row>
          <Col sm="10">
            <SkeletonCard />
          </Col>
        </Row>
        <Row>
          <Col sm="10">
            <SkeletonCard />
          </Col>
        </Row>
        <Row>
          <Col sm="10">
            <SkeletonCard />
          </Col>
        </Row>
        <Row>
          <Col sm="10">
            <SkeletonCard />
          </Col>
        </Row>
      </div>
    );
  }

  // 2) If Clerk is loaded but the user is not signed in, either redirect or show a notice
  if (!isSignedIn) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3>You are not signed in.</h3>
        <Link href="/login">
          <Button color="info" style={{ marginTop: "1rem" }}>
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  // 3) If Clerk is loaded and the user is signed in, render your normal component
  const firstName = user?.firstName;
  let examBoard = user?.unsafeMetadata?.examBoard;

  // Safely uppercase the exam board if it exists
  if (typeof examBoard === "string") {
    examBoard = examBoard.charAt(0).toUpperCase() + examBoard.slice(1);
  }

  return (
    <div className="learn-courses">
      <h1>Welcome Back {firstName}!</h1>

      {/* -- Card 1 -- */}
      <Row>
        <Col sm="10">
          <Card body>
            <CardBody className="course-card-body">
              <div>
                <CardTitle tag="h5">
                  <h1 style={{ color: "#17a2b8" }}>{examBoard} Mathematics</h1>
                </CardTitle>
                <CardText>
                  <h3>
                    <strong>Pure Mathematics</strong>
                  </h3>
                  <h5>Year 12</h5>
                </CardText>
              </div>

              <div style={{ width: "7rem", height: "7rem" }}>
                <CircularProgressbar value={0} text={"0%"} />
              </div>
            </CardBody>
            {/* THINGS LIKE THIS NEED TO BE DYNAMIC FOR INSTANCE E.G IF ITS CIE it should be CIE-maths-1 */}
            <Link className="router-link" href={`/learn/edx-maths-1`}>
              <Button color="info" block>
                Continue
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
      <br />

      {/* -- Card 2 -- */}
      <Row>
        <Col sm="10">
          <Card body>
            <CardBody className="course-card-body">
              <div>
                <CardTitle tag="h5">
                  <h1 style={{ color: "#17a2b8" }}>{examBoard} Mathematics</h1>
                </CardTitle>
                <CardText>
                  <h3>
                    <strong>Pure Mathematics</strong>
                  </h3>
                  <h5>Year 13</h5>
                </CardText>
              </div>

              <div style={{ width: "7rem", height: "7rem" }}>
                <CircularProgressbar value={0} text={"0%"} />
              </div>
            </CardBody>
            <Button color="info">Continue</Button>
          </Card>
        </Col>
      </Row>
      <br />

      {/* -- Card 3 -- */}
      <Row>
        <Col sm="10">
          <Card body>
            <CardBody className="course-card-body">
              <div>
                <CardTitle tag="h5">
                  <h1 style={{ color: "#17a2b8" }}>{examBoard} Mathematics</h1>
                </CardTitle>
                <CardText>
                  <h3>
                    <strong>Statistics</strong>
                  </h3>
                  <h5>Year 12</h5>
                </CardText>
              </div>

              <div style={{ width: "7rem", height: "7rem" }}>
                <CircularProgressbar value={0} text={"0%"} />
              </div>
            </CardBody>
            <Button color="info">Continue</Button>
          </Card>
        </Col>
      </Row>
      <br />

      {/* -- Card 4 -- */}
      <Row>
        <Col sm="10">
          <Card body>
            <CardBody className="course-card-body">
              <div>
                <CardTitle tag="h5">
                  <h1 style={{ color: "#17a2b8" }}>{examBoard} Mathematics</h1>
                </CardTitle>
                <CardText>
                  <h3>
                    <strong>Mechanics</strong>
                  </h3>
                  <h5>Year 12 & Year 13</h5>
                </CardText>
              </div>

              <div style={{ width: "7rem", height: "7rem" }}>
                <CircularProgressbar value={0} text={"0%"} />
              </div>
            </CardBody>
            <Button color="info">Continue</Button>
          </Card>
        </Col>
      </Row>
      <br />
    </div>
  );
}
