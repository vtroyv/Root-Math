import { ComputeEngine } from "../compute-engine-main/src/compute-engine";

class ComputeEngineConfig {
    constructor(questionType) {
        this.ce = new ComputeEngine();
        this.configure(questionType)


    }

    //you'll need to add in some logic for parsing text, which will enable us to send, 
    //MATHJSON line by line to our python server 

    //we wish to separate the latex 

    configure(questionType) {
        //go through Arno's code and make sure you understand it all perfectly, 
        //especially the following: 
        /*
        parse: (parser, lhs, until) => {
  if (!symbol(lhs)) return undefined; // We expect the lhs to be a symbol
  const expr = parser.parseExpression(until);
  if (!expr) return undefined;
  return ["To", lhs, expr]
}

        */
        
        this.ce.latexDictionary = [
           
            ...this.ce.latexDictionary, 
            {
                latexTrigger: '\\lim_', // adding_ allows Subscript to be bypassed 
                parse: (parser) => { 
                    const group = parser.parseGroup(); 
                    
                    if (!group) return undefined; 
                    
                    const expr = parser.parseExpression(); 
                    if (expr) return ["Limit", group, expr]; 
                    return ["Limit", group]; }
                    
            },
            
                {
                    latexTrigger: ['\\Rightarrow'],
                    kind: 'prefix',
                    precedence: 220,
                    associativity: 'right',
                    parse: 'Implies',
                  }

    
            ,
            {
                latexTrigger: ['='],
                prefix: 'prefix',
                
                precedence: 245,
                parse: (parser) => ['Equal', parser.parseExpression()]
              }
            ,

        {
            kind: 'infix', 
            precedence:270, 
            latexTrigger: '\\to',
            parse: (parser, lhs, until) => ["To", lhs, parser.parseExpression(until)]
              
        },
        {
            kind:'prefix', 
            precedence:270, 
            latexTrigger:'\\to', 
            parse:(parser, until) => ["To", parser.parseExpression(until)]

        },
        // {
        //     kind: 'infix',
        //     precedence: 0,
        //     latexTrigger: '\\\\',
        //     parse: (parser,lhs, until) => ['Newline', lhs, parser.parseExpression(until) ]

        //     //what does parser.parseExpression(until) mean though and what does it achieve 
        // },
        /*
        \begin{lines}
        \left(p\:+q\right)^2\:=\:p^2\:+\:2pq\:+\:q^2
        \\ =\:\left(p-q\right)_{}^2\:+\:4pq\\
         \Rightarrow\left(p+q\:^2\right)\:\ge\:4pq\\
          \Rightarrow\:p+q\:\ge\:\sqrt{4pq}
          \end{lines}

        */

    
          /*
          Notes in terms of parsing
          ---------------------------
           -> delimitter refers to brackets 

           -> Horizontal spacing
                --x-- you're probably going to need to ignore horizontal spacing because 
           

           -> if a bracket is missing isn't closed, eg opening bracket is black whilst closing is grey, 
              assumes that it isn't there at all 
                --x-- potential solution is to edit mfe code so that brackets automatically enclose
            

           -> an equal sign with no expression on both lhs & rhs causes an error, eg having equal sign at start of line

           -> '////' appears to be causing errors 
                --x-- update the latex dictionary to interpret it as a newline mathjson, eg [newline, rest of the expressions for that line ]
          



          */
       {
        kind: 'environment', 
        identifierTrigger: 'lines', 
        parse: (parser)=> {
            const latex = parser.parseTabular()
            console.log(latex)

            return latex

            

        }, 

       }
    ]
        //perhaps each question should have extra information stored in
        //its database eg, the question type should contain infomation on 
        //

        //also remember your going to need to do variable declarations
        //this is based on the type of question you'll be answering 


    }



    getEngine() {
        return this.ce; 

    }

    separateLines(latex) {
        
        const lines = latex.split('\\\\')

        return lines




    }
}

export default ComputeEngineConfig;