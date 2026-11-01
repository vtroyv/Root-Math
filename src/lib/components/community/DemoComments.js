'use client';
import { useState } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

/*
A hard-coded comments thread for screenshots ("See how it works") until real comments are
built (src/lib/docs/community-plan.md). Nothing is saved: votes, sorting and posting only
change this component's state. variant="lesson" is written for Quadratic Graphs part 3
("How many roots?"), variant="question" for Completing the Square Exam Style, but each shows
on every lesson / question until it's replaced by the real CommentsPanel.
Interactions only swap colours (no hover movement), per the styling preference.
*/

const STAFF = 'RadixMaths';

const THREADS = {
  lesson: {
    total: 23,
    comments: [
      {
        id: 'l1', author: STAFF, staff: true, pinned: true, ago: '3 days ago', score: 24,
        body: 'Common mistake on this part: a curve that *touches* the $x$-axis has **one repeated root**, not zero. What tripped you up? 👇',
        replies: [{ id: 'l1a', author: 'maya_k', ago: '2 days ago', score: 6, body: 'The touching case got me on task 2 😅 makes sense now' }],
      },
      {
        id: 'l2', author: 'surd_lord', ago: '1 day ago', score: 18,
        body: 'Is there a way to tell how many roots a quadratic has without sketching it?',
        replies: [
          { id: 'l2a', author: STAFF, staff: true, ago: '1 day ago', score: 15, body: "Yes! That's the discriminant, $b^2 - 4ac$. Positive: two roots. Zero: one repeated root. Negative: no real roots. It's coming up in part 4." },
          { id: 'l2b', author: 'jayden.w', ago: '20 hours ago', score: 7, body: 'so for $y = (x-3)^2 + 1$ the turning point is above the axis, which is why it has no roots?' },
          { id: 'l2c', author: 'ellie_maths', ago: '18 hours ago', score: 9, body: '@jayden.w yep, the minimum value is $1$ so it never gets down to $0$' },
        ],
      },
      {
        id: 'l3', author: 'priya_s', ago: '14 hours ago', score: 11,
        body: 'Tip: for $a < 0$ just picture the positive one flipped upside down. Helped me loads with the negative quadratic tasks',
        replies: [],
      },
      {
        id: 'l4', author: 'tomh_y12', ago: '9 hours ago', score: 8,
        body: 'The video for this part is really good, the bit where the curve slides up and down finally made it click',
        replies: [],
      },
      {
        id: 'l5', author: 'kofi.a', ago: '2 hours ago', score: 3,
        body: 'Does this come up in the actual exam or just in mocks?',
        replies: [{ id: 'l5a', author: 'lucy_r', ago: '1 hour ago', score: 5, body: "It's in loads of past papers, usually worth 2–3 marks" }],
      },
    ],
  },
  question: {
    total: 31,
    comments: [
      {
        id: 'q1', author: STAFF, staff: true, pinned: true, ago: '5 days ago', score: 21,
        body: 'Stuck on part (d)? Look back at your sketch from part (c). How many times does the line $y = -5$ cross the curve? 😉',
        replies: [],
      },
      {
        id: 'q2', author: 'maths_marcus', ago: '2 days ago', score: 14,
        body: 'got 3/10 on my first go. Completing the square when $x^2$ has a coefficient is evil',
        replies: [
          { id: 'q2a', author: STAFF, staff: true, ago: '2 days ago', score: 12, body: 'Take the coefficient out of the first two terms first, e.g. $2x^2 + 12x + 7 = 2(x^2 + 6x) + 7$, then complete the square inside the bracket.' },
          { id: 'q2b', author: 'maths_marcus', ago: '1 day ago', score: 4, body: '@RadixMaths ahh that makes it so much easier, 8/10 now' },
        ],
      },
      {
        id: 'q3', author: 'ben_t', ago: '1 day ago', score: 9,
        body: 'How do you get the turning point from the completed square form?',
        replies: [{ id: 'q3a', author: 'aisha_m', ago: '1 day ago', score: 13, body: 'If it\'s $a(x + p)^2 + q$ the turning point is $(-p,\\ q)$. The sign flip on $p$ catches everyone' }],
      },
      {
        id: 'q4', author: 'zara.k', ago: '11 hours ago', score: 10,
        body: 'For the sketch, drag the minimum point onto the turning point you found in part (b), not just somewhere close',
        replies: [],
      },
      {
        id: 'q5', author: 'harrison.l', ago: '3 hours ago', score: 16,
        body: 'finally 10/10 on my third attempt 🎉',
        replies: [{ id: 'q5a', author: STAFF, staff: true, ago: '2 hours ago', score: 4, body: 'Brilliant, well done! Its review cards are unlocked now, so you won\'t forget it.' }],
      },
    ],
  },
};

const AVATAR_COLOURS = ['#e8a33d', '#6c8ebf', '#b85c8a', '#5a9e6f', '#9a7bc4', '#d06b4f'];
const avatarColour = (name) => (name === STAFF ? 'var(--rm-teal)' : AVATAR_COLOURS[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % AVATAR_COLOURS.length]);

// *word* and **word** in the demo text, with the maths drawn by react-latex-next
function Body({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
  return (
    <p style={{ margin: '0.2rem 0 0.45rem', fontSize: '1.3rem', lineHeight: 1.45 }}>
      {parts.map((p, i) =>
        p.startsWith('**') ? <strong key={i}><Latex>{p.slice(2, -2)}</Latex></strong>
        : p.startsWith('*') ? <em key={i}><Latex>{p.slice(1, -1)}</Latex></em>
        : <Latex key={i}>{p}</Latex>,
      )}
    </p>
  );
}

function Votes({ score, vote, onVote }) {
  const arrow = (value, icon, label) => (
    <button
      type="button"
      onClick={() => onVote(vote === value ? 0 : value)}
      aria-label={label}
      aria-pressed={vote === value}
      style={{ background: 'none', border: 'none', padding: 0, lineHeight: 1, cursor: 'pointer', color: vote === value ? 'var(--rm-teal-deep)' : 'var(--rm-ink-faint)' }}
    >
      <i className={`bi ${vote === value ? `${icon}-fill` : icon}`} />
    </button>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '2rem', fontSize: '1.1rem' }}>
      {arrow(1, 'bi-caret-up', 'Upvote')}
      <span style={{ fontWeight: 'bold', color: vote ? 'var(--rm-teal-deep)' : 'var(--rm-ink)' }}>{score + vote}</span>
      {arrow(-1, 'bi-caret-down', 'Downvote')}
    </div>
  );
}

function Comment({ c, votes, onVote, isReply }) {
  return (
    <div style={{ display: 'flex', gap: '0.6rem', padding: isReply ? '0.5rem 0 0' : '0.75rem 0' }}>
      <Votes score={c.score} vote={votes[c.id] ?? 0} onVote={(v) => onVote(c.id, v)} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.45rem', fontSize: '1.02rem' }}>
          <span
            aria-hidden="true"
            style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: avatarColour(c.author), color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}
          >
            {c.staff ? '√' : c.author[0].toUpperCase()}
          </span>
          <strong style={{ color: 'var(--rm-ink)' }}>{c.author}</strong>
          {c.staff && <span className="learn-pill">Staff</span>}
          <span style={{ color: 'var(--rm-ink-faint)' }}>· {c.ago}</span>
          {c.pinned && (
            <span style={{ color: 'var(--rm-teal-deep)' }}>
              · <i className="bi bi-pin-angle-fill" aria-hidden="true" /> Pinned
            </span>
          )}
        </div>
        <Body text={c.body} />
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.95rem', color: 'var(--rm-ink-faint)' }}>
          <span><i className="bi bi-reply" aria-hidden="true" /> Reply</span>
          <span><i className="bi bi-flag" aria-hidden="true" /> Report</span>
        </div>

        {c.replies?.length > 0 && (
          <div style={{ marginTop: '0.25rem', paddingLeft: '0.75rem', borderLeft: '2px solid var(--rm-teal-soft)' }}>
            {c.replies.map((r) => (
              <Comment key={r.id} c={r} votes={votes} onVote={onVote} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const SORTS = { best: 'Best', new: 'New', top: 'Top' };
const sortBy = {
  best: (list) => list, // the hand-written order
  new: (list) => [...list].reverse(), // listed oldest first in THREADS
  top: (list) => [...list].sort((a, b) => b.score - a.score),
};

export default function DemoComments({ variant = 'lesson' }) {
  const thread = THREADS[variant];
  const [sort, setSort] = useState('best');
  const [votes, setVotes] = useState({});
  const [draft, setDraft] = useState('');
  const [posted, setPosted] = useState([]);

  const onVote = (id, value) => setVotes((v) => ({ ...v, [id]: value }));
  const post = () => {
    if (!draft.trim()) return;
    setPosted((p) => [{ id: `you-${Date.now()}`, author: 'you', ago: 'just now', score: 0, body: draft.trim(), replies: [] }, ...p]);
    setDraft('');
  };

  // pinned comments stay first whatever the sort, as they will in the real thing
  const pinned = thread.comments.filter((c) => c.pinned);
  const rest = sortBy[sort](thread.comments.filter((c) => !c.pinned));
  const list = [...pinned, ...posted, ...rest];

  return (
    <div style={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--rm-teal-deep)', fontWeight: 'bold' }}>
          Comments <span style={{ color: 'var(--rm-ink-faint)', fontWeight: 'normal' }}>· {thread.total + posted.length}</span>
        </h3>
        <div role="tablist" aria-label="Sort comments" style={{ display: 'flex', gap: '0.75rem', fontSize: '1.05rem' }}>
          {Object.entries(SORTS).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={sort === id}
              onClick={() => setSort(id)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: sort === id ? 'var(--rm-teal-deep)' : 'var(--rm-ink-faint)', fontWeight: sort === id ? 'bold' : 'normal', borderBottom: sort === id ? '2px solid var(--rm-teal)' : '2px solid transparent' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: '0.75rem 0 0.25rem' }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Ask a question or share a tip… (use $x^2$ for maths)"
          aria-label="Write a comment"
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1.1rem', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.92rem', color: 'var(--rm-ink-faint)' }}>
          <span>Be kind, and keep answers spoiler-free where you can.</span>
          <button type="button" className="btn btn-info btn-sm" onClick={post} style={{ color: '#fff' }}>
            Post
          </button>
        </div>
      </div>

      <div>
        {list.map((c, i) => (
          <div key={c.id} style={{ borderTop: i ? '1px solid #eee' : 'none' }}>
            <Comment c={c} votes={votes} onVote={onVote} />
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', paddingTop: '0.5rem', fontSize: '1rem', color: 'var(--rm-teal-deep)' }}>
        Show {thread.total - thread.comments.length} more comments
      </div>
    </div>
  );
}
