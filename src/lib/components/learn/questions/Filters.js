'use client';
import { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { treeCourseIds } from '@/lib/courses/courses';

/*
Filter controls shared by the Questions table and its Progress card (styles: "Questions page" in globals.css).
*/

// A small filter button with a dropdown: filled teal while its filter is on.
// Clicks inside the menu don't close it (only DropdownItems with an onClick do), so checkbox lists stay open.
// The menu goes in <body> so the table's scroll box doesn't cut it off.
export function FilterMenu({ label, active = false, end = false, children }) {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
      <DropdownToggle caret size="sm" color={active ? 'info' : 'secondary'} outline={!active}>
        {label}
      </DropdownToggle>
      <DropdownMenu container="body" end={end} className="learn-filter-menu">
        {children}
      </DropdownMenu>
    </Dropdown>
  );
}

/*
Nested course checkboxes (A level Maths › Pure Mathematics › Year 12 ...), from courseTree() in
src/lib/courses/courses.js. A parent is ticked when every course under it is, and half-ticked
(indeterminate) when some are; ticking it selects or clears them all. Every level starts open.
  selected  course ids;  onChange(ids)
*/
export function CourseTree({ tree, selected, onChange, idPrefix }) {
  const [closed, setClosed] = useState(() => new Set());
  const toggleOpen = (key) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleNode = (node) => {
    const ids = treeCourseIds(node);
    const all = ids.every((id) => selected.includes(id));
    onChange(all ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
  };

  const renderNodes = (nodes) => (
    <ul>
      {nodes.map((node) => {
        const ids = treeCourseIds(node);
        const ticked = ids.filter((id) => selected.includes(id)).length;
        const isOpen = !closed.has(node.key);
        const inputId = `${idPrefix}-${node.key.replace(/[^a-z0-9]+/gi, '-')}`;
        return (
          <li key={node.key}>
            <div className="learn-tree__row">
              <input
                id={inputId}
                type="checkbox"
                className="form-check-input"
                checked={ticked === ids.length}
                ref={(el) => {
                  if (el) el.indeterminate = ticked > 0 && ticked < ids.length;
                }}
                onChange={() => toggleNode(node)}
              />
              <label htmlFor={inputId}>{node.label}</label>
              {node.children && (
                <button
                  type="button"
                  className="learn-tree__caret"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? 'Hide' : 'Show'} ${node.label} courses`}
                  onClick={() => toggleOpen(node.key)}
                >
                  <i className={`bi ${isOpen ? 'bi-caret-down-fill' : 'bi-caret-right-fill'}`} aria-hidden="true" />
                </button>
              )}
            </div>
            {node.children && isOpen && renderNodes(node.children)}
          </li>
        );
      })}
    </ul>
  );

  return <div className="learn-tree">{renderNodes(tree)}</div>;
}
