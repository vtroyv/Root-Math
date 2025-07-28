'use client'

export default function QuestionNotesPane() {
    return (
        <div style={{
      padding: '1.5rem',
      height: '80vh',             // Fixed height for the pane
      background: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      margin: '1rem auto',
      boxSizing: 'border-box',
      overflowY:'auto'

    }}>

        <h1 style={{textAlign:'center', marginBottom:'1rem',  textDecoration:'underline', fontWeight:"bold",       color:"#17a2b8"  }}>
            Your Notes
        </h1>


    </div>
    );
}