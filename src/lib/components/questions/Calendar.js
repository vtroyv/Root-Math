
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

export default function ActivityCalendar() {
  // Display February 2025 by default
  const [month, setMonth] = useState(1); // 0=Jan, 1=Feb, etc.
  const [year, setYear] = useState(2025);

  // For the modal
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Hard-coded active days in this month
  const activeDays = [10, 20];

  // Hard-coded "activity" for active days
  const dailyActivity = [
    'Completed 2 questions',
    'Watched 1 tutorial video',
    'Reviewed notes',
  ];

  const toggleModal = () => setModalOpen(!modalOpen);

  // Handle day click: set date, open modal
  const handleDayClick = (day) => {
    setSelectedDate(day);
    toggleModal();
  };

  // Month navigation
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Utility: days in month
  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  // Utility: weekday of first day in month (0=Sun, 6=Sat)
  const getFirstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const daysInCurrentMonth = getDaysInMonth(month, year);
  const firstDayIndex = getFirstDayOfMonth(month, year);

  // Build a matrix of weeks
  const weeks = [];
  let currentDay = 1 - firstDayIndex;
  while (currentDay <= daysInCurrentMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay < 1 || currentDay > daysInCurrentMonth) {
        week.push(null);
      } else {
        week.push(currentDay);
      }
      currentDay++;
    }
    weeks.push(week);
  }

  // For displaying month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Check if selected date is "active" or not
  const isActiveDay = selectedDate && activeDays.includes(selectedDate);

  return (
    <Card
      style={{
        marginTop: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: 'none',
        // border: '1px solid black',
        borderRadius: '0.5rem',
        maxWidth: '600px',   // limit width to avoid horizontal scroll
        margin: 'auto',      // center it horizontally
      }}
    >
      <CardBody>
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <Button color="light" onClick={handlePrevMonth}>
              &lt; Prev
            </Button>
            <h5 style={{ fontWeight: 'bold', margin: 0 , color:'black'}}>
              {monthNames[month]} {year}
            </h5>
            <Button color="light" onClick={handleNextMonth}>
              Next &gt;
            </Button>
          </Col>
        </Row>

        <Table
          borderless
          style={{ tableLayout: 'fixed', width: '100%' }}
          size="sm"
        >
          <thead>
            <tr style={{ textAlign: 'center' }}>
              <th>Sun</th>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wIndex) => (
              <tr key={wIndex} style={{ textAlign: 'center' }}>
                {week.map((day, dIndex) => {
                  if (!day) {
                    return <td key={dIndex} />;
                  }
                  // Decide dot color: green if active day, else red
                  const dotColor = activeDays.includes(day) ? 'green' : 'red';
                  return (
                    <td key={dIndex}>
                      <Button
                        color="link"
                        onClick={() => handleDayClick(day)}
                        style={{ textDecoration: 'none', padding: 0 }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ color: dotColor, fontSize: '1rrem' }}>•</span>
                          {day}
                        </div>
                      </Button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>

      {/* Modal for day activity */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Activity for {selectedDate ? `${monthNames[month]} ${selectedDate}, ${year}` : ''}
        </ModalHeader>
        <ModalBody>
          {isActiveDay ? (
            <ul>
              {dailyActivity.map((activity, idx) => (
                <li key={idx}>{activity}</li>
              ))}
            </ul>
          ) : (
            <p>No activity completed today.</p>
          )}
        </ModalBody>
      </Modal>
    </Card>
  );
}
