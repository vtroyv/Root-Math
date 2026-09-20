import React, {useState} from 'react';
import Split from 'react-split'; 
import useMediaQuery from './useMediaQuery';


export default function TwoPaneResponsive({question, feedback}) {
  console.log('The question is ', question)
    const title = question.title
    const isMobile = useMediaQuery('(max-width:768px)');
    const [activeMobileTab, setActiveMobileTab] = useState('question');

    if (isMobile) {
        return (
            <div
            style={{
              marginTop: '1rem',
          border: '1px solid #ccc',
          height: 'calc(100vh - 2rem)',
          display: 'flex',
          flexDirection: 'column',  
            }}>

            <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
          }}
        >


                   <button
            onClick={() => setActiveMobileTab('question')}
            style={tabButtonStyle(activeMobileTab === 'question')}
          >
            Question
          </button>

           <button
            onClick={() => setActiveMobileTab('feedback')}
            style={tabButtonStyle(activeMobileTab === 'feedback')}
          >
            Instructions, Feedback and Solutions
          </button>
            </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeMobileTab === 'question' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {question}
            </div>
          )}
          {activeMobileTab === 'feedback' && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
              }}
            >
              {feedback}
            </div>
          )}
    
        </div>


            </div>

        )
    }

    return (
         <div
      style={{
        marginTop: '1rem',
        border: '1px solid #ccc',
        height: 'calc(100vh - 2rem)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
       <Split
        direction="horizontal"
        sizes={[50, 50]}
        gutterSize={6}
        gutterAlign="center"
        gutter={createGutter}
        style={{
          flex: 1,
          display: 'flex',
          width: '100%',
          height:'100%'
          
        }}
      >
        <aside
          style={{
            borderRight: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '1rem',
            boxSizing: 'border-box',
            height:'100%'
          }}
        >
          {question}
        </aside>
         <aside
          style={{
            borderRight: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '1rem',
            boxSizing: 'border-box',
            height:'100%'
          }}
        >
          {feedback}
        </aside>

      </Split>
    </div>
    );
}


/** Creates a thicker gray gutter for react-split's draggable handle */
function createGutter(index, direction) {
  const gutterEl = document.createElement('div');
  gutterEl.className = `gutter gutter-${direction}`;
  gutterEl.style.backgroundColor = '#ddd';
  gutterEl.style.cursor = 'col-resize';
  return gutterEl;
}

/** A little helper style for the 3 big "mobile" tab buttons. */
function tabButtonStyle(isActive) {
  return {
    flex: 1,
    padding: '1rem',
    border: 'none',
    backgroundColor: isActive ? '#fff' : 'transparent',
    borderBottom: isActive ? '2px solid #000' : 'none',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
  };
}
