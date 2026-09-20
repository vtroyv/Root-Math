'use client';
import { useState } from 'react';

export default function CommentsPane({ part }) {
  // Hardcoded initial comments with empty replies arrays
  const initialComments = [
    { id: 1, text: "Great lesson, I loved it!", votes: 5, replies: [] },
    { id: 2, text: "I found the explanations confusing.", votes: -1, replies: [] },
    { id: 3, text: "This really helped me understand the material.", votes: 3, replies: [] },
  ];

  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  // Track which comment is being replied to and its reply text
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');

  if (!part) return <p>No part selected yet.</p>;

  // Add a new top-level comment (added at the top)
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newComm = { id: Date.now(), text: newComment.trim(), votes: 0, replies: [] };
    setComments([newComm, ...comments]);
    setNewComment('');
  };

  // Upvote/downvote for top-level comments
  const handleUpvote = (id) => {
    setComments(comments.map(comment =>
      comment.id === id ? { ...comment, votes: comment.votes + 1 } : comment
    ));
  };

  const handleDownvote = (id) => {
    setComments(comments.map(comment =>
      comment.id === id ? { ...comment, votes: comment.votes - 1 } : comment
    ));
  };

  // Upvote/downvote for replies
  const handleReplyUpvote = (commentId, replyId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === replyId ? { ...reply, votes: reply.votes + 1 } : reply
          )
        };
      }
      return comment;
    }));
  };

  const handleReplyDownvote = (commentId, replyId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies.map(reply =>
            reply.id === replyId ? { ...reply, votes: reply.votes - 1 } : reply
          )
        };
      }
      return comment;
    }));
  };

  // Add a reply to a comment
  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;
    const newReply = { id: Date.now(), text: replyText.trim(), votes: 0 };
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...(comment.replies || []), newReply] };
      }
      return comment;
    }));
    setReplyingCommentId(null);
    setReplyText('');
  };

  return (
    <div style={{
      padding: '1.5rem',
      maxWidth: '600px',
      margin: '1rem auto',
      background: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Comments
      </h3>
      
      {/* Scrollable Comments List */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        marginBottom: '1rem',
        paddingRight: '0.5rem'
      }}>
        {comments.map(comment => (
          <div key={comment.id} style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '0.5rem', // reduced padding
            marginBottom: '0.5rem',
            background: '#fff',
          }}>
            {/* Top row: Vote controls and comment text */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                marginRight: '0.5rem',
                textAlign: 'center',
                width: '30px' // reduced width
              }}>
                <button onClick={() => handleUpvote(comment.id)} style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  ▲
                </button>
                <div style={{ fontSize: '0.9rem' }}>{comment.votes}</div>
                <button onClick={() => handleDownvote(comment.id)} style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}>
                  ▼
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>
                  {comment.text}
                </p>
                <button onClick={() => setReplyingCommentId(comment.id)} style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: 0
                }}>
                  Reply
                </button>
              </div>
            </div>
            
            {/* Reply input for this comment */}
            {replyingCommentId === comment.id && (
              <div style={{ marginTop: '0.5rem', marginLeft: '2rem' }}>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '40px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    padding: '0.25rem',
                    fontSize: '0.85rem',
                    marginBottom: '0.25rem'
                  }}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                />
                <button 
                  onClick={() => handleAddReply(comment.id)} 
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}>
                  Add Reply
                </button>
              </div>
            )}

            {/* Render any replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginTop: '0.5rem', marginLeft: '2rem' }}>
                {comment.replies.map(reply => (
                  <div key={reply.id} style={{
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    marginBottom: '0.5rem',
                    background: '#fefefe'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        marginRight: '0.5rem',
                        textAlign: 'center',
                        width: '25px'
                      }}>
                        <button onClick={() => handleReplyUpvote(comment.id, reply.id)} style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}>
                          ▲
                        </button>
                        <div style={{ fontSize: '0.8rem' }}>{reply.votes}</div>
                        <button onClick={() => handleReplyDownvote(comment.id, reply.id)} style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}>
                          ▼
                        </button>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>{reply.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New Comment Input Area (fixed at bottom) */}
      <div style={{
        borderTop: '1px solid #ddd',
        paddingTop: '1rem'
      }}>
        <textarea
          style={{
            width: '100%',
            minHeight: '60px', // smaller comment input area
            borderRadius: '4px',
            border: '1px solid #ccc',
            padding: '0.5rem',
            marginBottom: '0.5rem'
          }}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button 
          onClick={handleAddComment} 
          style={{
            width: '100%',
            padding: '0.5rem',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}>
          Add Comment
        </button>
      </div>
    </div>
  );
}
