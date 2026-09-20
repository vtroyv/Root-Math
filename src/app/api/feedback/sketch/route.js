export async function POST(request) {
    const body = await request.json();
    console.log('The current body that i would like to send in the sketch route is ', body)

    const feedback ={
        reducedCoordinates: body.reducedCoordinates,
        questionData: body.questionData
    }
    console.log('The feedback data that i would like to send is ', feedback)

    try{
        //Send the parsed body to the fastAPI server
        const response = await fetch('http://127.0.0.1:8000/sketch/feedback', {
            method:'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(feedback)
        });


        //Parse the response from the FastAPI Server
        const result = await response.json()
        console.log('the result returned is ', result)
        return new Response(
            JSON.stringify({message:'completed', data: result}),
            {
                headers: {'Content-Type': 'application/json'},
            }
        );
    } catch (error){
        //Handle errors
        return new Response(
            JSON.stringify({message:'error', error: error.message}),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            }
        )
    }
}
