'use client'
import { Button } from "reactstrap";
import { useDrawerStore } from "@/lib/zustand/providers/question-drawer-state-provider";
import CombinationTypeRenderer from "../combinationQuestionTypes/combinationTypeRenderer";
export default function Combination({question}) {

     const openDrawer = useDrawerStore(s => s.open)
     const title = question?.title || '';
  const formattedTitle = title.includes('-')
    ? title
        .split('-')
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    : title;

    return (
         <div
      style={{
        height:         '100%',
        width:          '100%',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
            <div style={{
          height:      '100%',
          width:       '100%',
          maxWidth:    '900px',
          display:     'flex',
          flexDirection:'column',
          padding:     '1rem',
          background:  '#fff',
          borderRadius:'8px',
          boxShadow:   '0 2px 8px rgba(0,0,0,0.1)',
          boxSizing:   'border-box',
        }}
      >

             <h1
          style={{
            color:       '#17a2b8',
            fontWeight:  'bold',
            textAlign:   'center',
            margin:      0,
            marginBottom:'1rem',
          }}
        >
          {formattedTitle}
        </h1>

       <div
        style={{
      flex: 1,                 // Take up remaining height
      overflowY: 'auto',       // Enable vertical scroll
      paddingRight: '0.5rem',  // Optional: avoid scrollbar overlap
    }}>
         {question.combinationDetails.map((block,i) => <CombinationTypeRenderer key={i} block={block} />)}
       </div>

        <div
                style={{'display':"flex", flexDirection:'row', gap :'5px', marginTop:'auto'}}>
                    <Button
                style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
                color='secondary'
                outline
                block
                >
                  Hint
                </Button>
                    <Button
                style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
                color='secondary'
                outline
                block
                >
                  Save
                </Button>
                <Button
                  style={{
                    marginTop: '1rem',
                    alignSelf: 'center',
                    width:     '40%',
                  }}
                  color="info"
                  outline
                  block
                  onClick={() => handleSubmit()}
                >
                  Submit
                </Button>
              
               
                    <Button
                style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
                color='secondary'
                outline
                block
                >
                  Reset
                </Button>
                     <Button
                style={{marginTop:'1rem', alignSelf:'center', maxWidth:"10%"}}
                color='secondary'
                outline
                block
                onClick={openDrawer}
                >
                  Next
                </Button>
                </div>
      </div>
    </div>
    );
}