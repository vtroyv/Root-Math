
export async function POST(request, {params}) {
    // Parse the JSON body from the incoming request 
    const body = await request.json();
    // console.log('The current body that i would like to send is ', body)

    const feedback = {
        task: body.task, 
        latexInput: body.latexInput
    }
    console.log('The feedback is given by ', feedback)
    // console.log('The feedback i wish to send is ', feedback)
    try {
        const response = await fetch('http://127.0.0.1:8000/lesson-feedback', {
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

