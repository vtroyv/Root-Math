// Small pieces shared by the Register Interest and Contact forms.
import React from 'react';

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="rm-field__error" id={`${id}-error`} role="alert">
      {message}
    </p>
  );
}

/* A spam trap: a field people never see, so only bots fill it in. The API routes
   quietly ignore any submission that has it set. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
      <label htmlFor="website">Leave this empty</label>
      <input
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
