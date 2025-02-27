"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetQuestionsQuery } from "@/lib/redux/slices/apiSlice";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Input,
  Card,
  CardBody,
  Badge,
  Button,
  FormGroup,
  Label,
  Input as StrapInput,
  Row,
  Col
} from "reactstrap";

import Progress from "./Progress";
import ActivityCalendar from "./Calendar";

// Example topics
const ALL_TOPICS = [
  "Proof",
  "Algebra and Functions",
  "Quadratic Functions",
  "Vectors",
  "Integration",
  "Logarithms"
];

export default function QuestionTable() {
  // Dropdown open states
  const [statusOpen, setStatusOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState(null);
  const [topicFilter, setTopicFilter] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState(null);

  // Search text
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle dropdowns
  const toggleStatus = () => setStatusOpen(!statusOpen);
  const toggleTopic = () => setTopicOpen(!topicOpen);
  const toggleDifficulty = () => setDifficultyOpen(!difficultyOpen);

  // Helper: clear all filters
  const clearAllFilters = () => {
    setStatusFilter(null);
    setTopicFilter([]);
    setDifficultyFilter(null);
    setSearchQuery("");
  };

  const dispatch = useDispatch();
  const router = useRouter();

  // Load data from Redux RTK Query
  const { data, isLoading, error } = useGetQuestionsQuery();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  // Toggle a topic in the topicFilter array
  const handleTopicToggle = (topic) => {
    if (topicFilter.includes(topic)) {
      setTopicFilter(topicFilter.filter((t) => t !== topic));
    } else {
      setTopicFilter([...topicFilter, topic]);
    }
  };

  // Filter the data
  const filteredData = data.filter((question) => {
    // Status
    if (statusFilter && question.status !== statusFilter) return false;
    // Topics (multi-select)
    if (topicFilter.length > 0 && !topicFilter.includes(question.topic))
      return false;
    // Difficulty
    if (difficultyFilter && question.difficulty !== difficultyFilter) return false;
    // Search (title/topic/difficulty)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const title = question.title.toLowerCase();
      const topic = question.topic.toLowerCase();
      const difficulty = question.difficulty.toLowerCase();
      if (!(title.includes(q) || topic.includes(q) || difficulty.includes(q))) {
        return false;
      }
    }
    return true;
  });

  // Build table rows
  const tableRows = filteredData.map((question) => (
    <tr key={question.title}>
      <td>
        {/* Status icon */}
        {question.status === "Completed" ? (
          <i
            className="bi bi-check-square-fill"
            style={{ fontSize: "1.25rem", color: "green" }}
          />
        ) : question.status === "Incorrect" ? (
          <i
            className="bi bi-x-square-fill"
            style={{ color: "red", fontSize: "1.25rem" }}
          />
        ) : (
          <i
            className="bi bi-dash-square-fill"
            style={{ fontSize: "1.25rem", color: "grey" }}
          />
        )}
      </td>
      <td>
        <Link
          href={`questions/${question.title.split(" ").join("-")}`}
          state={question}
          className="quiz-link"
        >
          {question.title.split("-").join(" ")}
        </Link>
      </td>
      <td>{question.topic}</td>
      <td>{question.difficulty}</td>
    </tr>
  ));

  return (
    <Row>
      {/* Left Column: Table */}
      <Col md={8}>
        <Card
          style={{
            marginTop: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            border: "none",
            borderRadius: "0.5rem"
          }}
        >
          <CardBody>
            {/* Active Filters / Clear All */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {statusFilter && (
                  <Badge
                    color="info"
                    pill
                    style={{ cursor: "pointer" }}
                    onClick={() => setStatusFilter(null)}
                  >
                    Status: {statusFilter} <i className="bi bi-x-lg ms-1"></i>
                  </Badge>
                )}

                {/* If multiple topics, display them all */}
                {topicFilter.map((topic) => (
                  <Badge
                    key={topic}
                    color="info"
                    pill
                    style={{ cursor: "pointer" }}
                    onClick={() => handleTopicToggle(topic)}
                  >
                    Topic: {topic} <i className="bi bi-x-lg ms-1"></i>
                  </Badge>
                ))}

                {difficultyFilter && (
                  <Badge
                    color="info"
                    pill
                    style={{ cursor: "pointer" }}
                    onClick={() => setDifficultyFilter(null)}
                  >
                    Difficulty: {difficultyFilter} <i className="bi bi-x-lg ms-1"></i>
                  </Badge>
                )}

                {(statusFilter ||
                  topicFilter.length > 0 ||
                  difficultyFilter ||
                  searchQuery) && (
                  <Button color="secondary" outline size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <Table responsive striped>
              <thead>
                <tr>
                  <th>
                    {/* Status Filter Dropdown */}
                    <Dropdown isOpen={statusOpen} toggle={toggleStatus} color="info">
                      <DropdownToggle caret color="info" size="sm" outline>
                        Status
                      </DropdownToggle>
                      <DropdownMenu container="body">
                        <DropdownItem onClick={() => setStatusFilter("Completed")}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Completed</span>
                            <i
                              className="bi bi-check-square-fill"
                              style={{ color: "green", fontSize: "1.25rem" }}
                            ></i>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => setStatusFilter("Incorrect")}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Incorrect</span>
                            <i
                              className="bi bi-x-square-fill"
                              style={{ color: "red", fontSize: "1.25rem" }}
                            ></i>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => setStatusFilter("Todo")}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Todo</span>
                            <i
                              className="bi bi-dash-square-fill"
                              style={{ color: "grey", fontSize: "1.25rem" }}
                            ></i>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => setStatusFilter(null)}>
                          All
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </th>
                  <th>
                    <h5
                      style={{
                        marginBottom: "0px",
                        padding: "0px",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#17a2b8"
                      }}
                    >
                      Name
                    </h5>
                  </th>
                  <th>
                    {/* Topic Filter Dropdown (multi-select with checkboxes) */}
                    <Dropdown isOpen={topicOpen} toggle={toggleTopic}>
                      <DropdownToggle caret color="info" size="sm" outline>
                        Topics
                      </DropdownToggle>
                      <DropdownMenu style={{ padding: "0.5rem" }} container="body">
                        {ALL_TOPICS.map((topic) => {
                          const checked = topicFilter.includes(topic);
                          return (
                            <DropdownItem key={topic} toggle={false}>
                              <FormGroup check>
                                <Label check style={{ cursor: "pointer" }}>
                                  <StrapInput
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleTopicToggle(topic)}
                                  />
                                  {topic}
                                </Label>
                              </FormGroup>
                            </DropdownItem>
                          );
                        })}
                        <DropdownItem divider />
                        <DropdownItem onClick={() => setTopicFilter([])}>
                          Clear Topics
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </th>
                  <th>
                    {/* Difficulty Filter Dropdown */}
                    <Dropdown isOpen={difficultyOpen} toggle={toggleDifficulty}>
                      <DropdownToggle caret color="info" size="sm" outline>
                        Difficulty
                      </DropdownToggle>
                      <DropdownMenu container="body">
                        <DropdownItem onClick={() => setDifficultyFilter("Easy")}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Easy</span>
                            <i
                              className="bi bi-emoji-heart-eyes"
                              style={{ color: "green", fontSize: "1.25rem" }}
                            ></i>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => setDifficultyFilter("Medium")}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Medium</span>
                            <i
                              className="bi bi-emoji-grin"
                              style={{ color: "orange", fontSize: "1.25rem" }}
                            ></i>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => setDifficultyFilter("exam")}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Exam</span>
                            <i
                              className="bi bi-emoji-grimace"
                              style={{ color: "black", fontSize: "1.25rem" }}
                            ></i>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => setDifficultyFilter("Challenge")}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>Challenge</span>
                            <i
                              className="bi bi-emoji-dizzy"
                              style={{ color: "red", fontSize: "1.25rem" }}
                            ></i>
                          </div>
                        </DropdownItem>
                        <DropdownItem onClick={() => setDifficultyFilter(null)}>
                          All
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>

      {/* Right Column: Search, Progress, Calendar */}
      <Col md={4}>
        {/* Search Input */}
        <div style={{ marginTop: "1rem" }}>
          <InputGroup>
            <Input
              placeholder="Search by name, topic or difficulty"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: "2rem", borderRadius: "10px" }}
            />
            <div
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                cursor: "pointer"
              }}
            >
              {searchQuery ? (
                <i className="bi bi-x-lg" onClick={() => setSearchQuery("")} />
              ) : (
                <i className="bi bi-search" />
              )}
            </div>
          </InputGroup>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <Progress />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <ActivityCalendar />
        </div>
      </Col>
    </Row>
  );
}
