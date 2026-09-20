
//DO NEXT 
//FIX THIS SO IT CAN HANDLE MULTIPLE TYPES
export async function POST(request, {params}) {
    // Parse the JSON body from the incoming request 
    const body = await request.json();
    console.log('The body i would like to send is ', body)
  

    const taskType = body.taskType;



  
    let url;
    let feedback;
    

    switch (taskType) {
        case "multipleChoiceImages":
            // create the object and url 
             feedback = {
                task:body.task, 
                selectedChoice: body.selectedChoice,
                taskType: taskType,
            }
            url ='http://127.0.0.1:8000/lesson-feedback/multiple-choice-images'
            break;
        
        case "sketch": 
            feedback = {
                task: body.task, 
                reducedCoordinates: body.reducedCoordinates,
                taskType: taskType,
            }
            url ='http://127.0.0.1:8000/lesson-feedback/sketch'
            break;

        case "multipleChoice":
            feedback ={
                task: body.task,
                selectedChoice: body.selectedChoice, 
                taskType: taskType, 
            }
            url = 'http://127.0.0.1:8000/lesson-feedback/multiple-choice'
            console.log('The feedback id like to send is ', feedback)
            break;

        case 'image':
            feedback = {
                task: body.task, 
                compiledStrings: body.compiledStrings, 
                taskType: taskType, 
            }
            url = 'http://127.0.0.1:8000/lesson-feedback/image'
            break;

        case 'curveAndMfe':
            feedback={
                task: body.task, 
                compiledStrings: body.compiledStrings,
                reducedCoordinates: body.reducedCoordinates,
                taskType: taskType,
            }
            
            url = 'http://127.0.0.1:8000/lesson-feedback/curve-and-mfe'
            break;

        default:
            feedback = {
                task: body.task, 
                latexInput: body.latexInput 
            }
            url = 'http://127.0.0.1:8000/lesson-feedback/'
    }

    try {



        const response = await fetch(url, {
            method:'POST',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(feedback), //Send the body as JSON
        });

        //Parse the response from the FastAPI server
        const result = await response.json();
        console.log('The result is ', result)

        return new Response(
            JSON.stringify(result), 
            
            {
                headers: {'Content-Type':'application/json'},
            }
        );
    
    } catch(error){
        //Handle errors
        return new Response(
        JSON.stringify({message:'error', error: error.message}),

            {
                headers: { 'Content-Type': 'application/json'},
                status:500,
            }
        );
    }
}

