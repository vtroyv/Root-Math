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
        borderRadius: "0.5rem",
        marginBottom: "1.5rem",
      }}
    />
  );
}

export default function LearnCourses() {
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

  // 2) If Clerk is loaded but the user is not signed in
  if (!isSignedIn) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3>You are not signed in.</h3>
        <Link href="/sign-in">
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
  if (typeof examBoard === "string") {
    examBoard = examBoard.charAt(0).toUpperCase() + examBoard.slice(1);
  }

  // A shared style for all course cards
  const cardStyle = {
    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
    border: "none",
    borderRadius: "0.5rem",
    marginBottom: "1rem",
  };

  return (
    <div className="learn-courses">
      <h1 style={{ fontSize: "2.5rem", margin: "0 0 0.5rem 0" }}>
        <strong>Welcome Back {firstName}!</strong>
      </h1>

      {/* Card 1 */}
      <Row>
        <Col sm="10">
          <Card body style={cardStyle}>
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
            <Link className="router-link" href={`/learn/edx-maths-1`}>
              <Button color="info" block>
                Continue
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      {/* Card 2 */}
      <Row>
        <Col sm="10">
          <Card body style={cardStyle}>
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
            <Button color="info" block>
              Continue
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Card 3 */}
      <Row>
        <Col sm="10">
          <Card body style={cardStyle}>
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
            <Button color="info" block>
              Continue
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Card 4 */}
      <Row>
        <Col sm="10">
          <Card body style={cardStyle}>
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
            <Button color="info" block>
              Continue
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
