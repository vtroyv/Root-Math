'use client'
import { useState } from "react"
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Badge,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap"
import classNames from "classnames"
import { FaEdit, FaSave, FaTrash, FaSignOutAlt } from "react-icons/fa"

// Example Sub-Components for each section with enhanced styling

function ProfileSection() {
  return (
    <Card className="mb-4 shadow-sm">
      <CardBody>
        <CardTitle tag="h5" className="text-info">
          <FaEdit /> Basic Account Management
        </CardTitle>
        <CardText>
          View or update your account information here.
        </CardText>
        <ul className="list-unstyled">
          <li>
            <strong>Email:</strong> user@example.com{" "}
            <Button color="info" size="sm" className="ml-2">
              Change <FaEdit />
            </Button>
          </li>
          <li>
            <strong>Year:</strong> Year 12
          </li>
          <li>
            <strong>School:</strong> Example High School
          </li>
          <li className="mt-3">
            <Button color="success" size="sm">
              Update Details <FaSave />
            </Button>
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}

function SecuritySection() {
  return (
    <Card className="mb-4 shadow-sm">
      <CardBody>
        <CardTitle tag="h5" className="text-info">
          <FaEdit /> Security &amp; Privacy
        </CardTitle>
        <CardText>
          Manage your active sessions, devices, and security questions.
        </CardText>
        <ul className="list-unstyled">
          <li>
            <strong>Active Sessions:</strong> 3 Devices
            <Button color="danger" size="sm" className="ml-2">
              <FaTrash /> End Session
            </Button>
          </li>
          <li className="mt-2">
            <strong>Security Questions:</strong> Set Up{" "}
            <Button color="info" size="sm">
              <FaEdit /> Update
            </Button>
          </li>
          <li className="mt-3">
            <Button color="success" size="sm">
              Save Changes <FaSave />
            </Button>
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}

function ActivityLogsSection() {
  return (
    <Card className="mb-4 shadow-sm">
      <CardBody>
        <CardTitle tag="h5" className="text-info">
          <FaEdit /> Account Activity Logs
        </CardTitle>
        <CardText>
          See recent activity on your account (logins, changes, etc.).
        </CardText>
        <Alert color="secondary">
          No recent activity. Your account is secure!
        </Alert>
        <Button color="info" size="sm">
          Refresh Logs <FaEdit />
        </Button>
      </CardBody>
    </Card>
  )
}

function SubscriptionSection() {
  return (
    <Card className="mb-4 shadow-sm">
      <CardBody>
        <CardTitle tag="h5" className="text-info">
          <FaEdit /> Subscription / Plans Management
        </CardTitle>
        <CardText>
          Manage your subscriptions or upgrade/downgrade plans.
        </CardText>
        <ul className="list-unstyled">
          <li>
            <strong>Current Plan:</strong> <Badge color="info">Premium</Badge>
          </li>
          <li className="mt-2">
            <Button color="primary" size="sm" className="mr-2">
              Upgrade <FaEdit />
            </Button>
            <Button color="warning" size="sm">
              Downgrade <FaEdit />
            </Button>
          </li>
          <li className="mt-3">
            <Button color="success" size="sm">
              View Billing History <FaEdit />
            </Button>
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}

function BillingSection() {
  return (
    <Card className="mb-4 shadow-sm">
      <CardBody>
        <CardTitle tag="h5" className="text-info">
          <FaEdit /> Billing Information
        </CardTitle>
        <CardText>View or update your payment methods.</CardText>
        <ul className="list-unstyled">
          <li>
            <strong>Payment Method:</strong> Visa ending in 1234{" "}
            <Button color="info" size="sm" className="ml-2">
              Change <FaEdit />
            </Button>
          </li>
          <li className="mt-2">
            <strong>Billing History:</strong>
            <Button color="info" size="sm" className="ml-2">
              View Invoices <FaEdit />
            </Button>
          </li>
          <li className="mt-3">
            <Button color="success" size="sm">
              Save Changes <FaSave />
            </Button>
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}

function PreferencesSection() {
  return (
    <Card className="mb-4 shadow-sm">
      <CardBody>
        <CardTitle tag="h5" className="text-info">
          <FaEdit /> Manage Preferences
        </CardTitle>
        <CardText>
          Update communication preferences and notifications (e.g., newsletters).
        </CardText>
        <Form>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" /> Receive Newsletters
            </Label>
          </FormGroup>
          <FormGroup check className="mt-2">
            <Label check>
              <Input type="checkbox" /> Enable Notifications
            </Label>
          </FormGroup>
          <FormGroup check className="mt-2">
            <Label check>
              <Input type="checkbox" /> SMS Alerts
            </Label>
          </FormGroup>
          <Button color="success" size="sm" className="mt-3">
            Save Preferences <FaSave />
          </Button>
        </Form>
      </CardBody>
    </Card>
  )
}

// Main Account Page Component with Enhanced Styling
export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const handleTabChange = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <div className="container mt-5">
      <Row>
        {/* Sidebar */}
        <Col md="3">
          <Nav vertical pills className="mb-4">
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "profile" })}
                onClick={() => handleTabChange("profile")}
                style={{ cursor: "pointer" }}
                href="#"
              >
                <FaEdit /> Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "security" })}
                onClick={() => handleTabChange("security")}
                style={{ cursor: "pointer" }}
                href="#"
              >
                <FaEdit /> Security &amp; Privacy
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "activity" })}
                onClick={() => handleTabChange("activity")}
                style={{ cursor: "pointer" }}
                href="#"
              >
                <FaEdit /> Activity Logs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "subscription" })}
                onClick={() => handleTabChange("subscription")}
                style={{ cursor: "pointer" }}
                href="#"
              >
                <FaEdit /> Subscription / Plans
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "billing" })}
                onClick={() => handleTabChange("billing")}
                style={{ cursor: "pointer" }}
                href="#"
              >
                <FaEdit /> Billing
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classNames({ active: activeTab === "preferences" })}
                onClick={() => handleTabChange("preferences")}
                style={{ cursor: "pointer" }}
                href="#"
              >
                <FaEdit /> Preferences
              </NavLink>
            </NavItem>
          </Nav>
        </Col>

        {/* Content Area */}
        <Col md="9">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "activity" && <ActivityLogsSection />}
          {activeTab === "subscription" && <SubscriptionSection />}
          {activeTab === "billing" && <BillingSection />}
          {activeTab === "preferences" && <PreferencesSection />}
        </Col>
      </Row>
    </div>
  )
}
