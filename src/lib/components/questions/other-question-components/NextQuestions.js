'use client'
import {Table, Offcanvas, OffcanvasBody, OffcanvasHeader, Badge} from 'reactstrap'
import { useDrawerStore } from '@/lib/zustand/providers/question-drawer-state-provider';
import { useEffect } from 'react';

export default function NextQuestions({problems, onSelect}) {
    const { isOpen, toggle } = useDrawerStore()

  useEffect(()=>{
console.log('THe global state for whether the drawer is open or not is given by ', isOpen)
  },[isOpen])

    return (
        <div>
            <Offcanvas
  direction="start"
  isOpen={isOpen}
  toggle={toggle}
  style={{ width: '320px' }}
>
  <OffcanvasHeader
    toggle={toggle}
    style={{
      backgroundColor: '#17a2b8',
      color: 'white',
      fontWeight: 'bold',
    }}
  >
    Select Next Problem
  </OffcanvasHeader>

  <OffcanvasBody className="p-0">
    <Table
      borderless
      hover
      striped
      size="md"
      className="mb-0"
      style={{ cursor: 'pointer' }}
    >
      <tbody>
        {problems.map((q) => (
          <tr
            key={q.id}
            onClick={() => {
              /* navigate to q.id */
              onSelect(q)
              // e.g. router.push(`/learn/questions/${q.title}`);
            }}
          >
            {/* Status icon cell (replace with real status if you have it) */}
            <td style={{ width: '1.5rem', textAlign: 'center' }}>
              <i
                className="bi bi-dash-square-fill"
                style={{ fontSize: '1.25rem', color: 'grey' }}
              />
            </td>

            {/* Title */}
            <td style={{ fontWeight: 500 }}>
              {q.title}
            </td>

            {/* Topic */}
            <td style={{ whiteSpace: 'nowrap' }}>
              <Badge color="info" pill>
                {q.topic}
              </Badge>
            </td>

            {/* Difficulty */}
            <td style={{ whiteSpace: 'nowrap', paddingLeft: '0.5rem' }}>
              <small className="text-muted">
                {q.difficulty || ''}
              </small>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </OffcanvasBody>
</Offcanvas>
        </div>
    );
}