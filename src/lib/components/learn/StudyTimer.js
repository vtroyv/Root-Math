'use client';
import { useEffect } from 'react';
import { localToday } from '@/lib/reviews/localDay';

/*
Counts a student's active minutes on the learn pages, for the study-time goal on the Questions page's
activity map (src/lib/activity/goals.js). Mounted once in learn/layout.js; renders nothing.
A minute counts when the tab is visible and the student clicked, typed, scrolled or touched in it,
so a tab left open overnight doesn't count. Minutes are sent every 5 minutes, and when the tab is
hidden or closed (sendBeacon still delivers while the page unloads).
*/

const EVENTS = ['pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'];
const SEND_EVERY = 5;

export default function StudyTimer() {
  useEffect(() => {
    let active = false;
    let pending = 0;
    const markActive = () => {
      active = true;
    };

    const send = () => {
      if (!pending) return;
      const body = JSON.stringify({ minutes: pending, today: localToday() });
      pending = 0;
      const queued = navigator.sendBeacon?.('/api/activity', new Blob([body], { type: 'application/json' }));
      if (!queued) {
        fetch('/api/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
      }
    };

    const tick = setInterval(() => {
      if (active && document.visibilityState === 'visible') pending += 1;
      active = false;
      if (pending >= SEND_EVERY) send();
    }, 60_000);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') send();
    };

    // capture: scrolls inside panels (lesson panes, the question drawer) don't bubble to window
    EVENTS.forEach((e) => window.addEventListener(e, markActive, { passive: true, capture: true }));
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', send);
    return () => {
      clearInterval(tick);
      EVENTS.forEach((e) => window.removeEventListener(e, markActive, { capture: true }));
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', send);
      send();
    };
  }, []);

  return null;
}
