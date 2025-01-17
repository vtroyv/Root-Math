export async function POST(request) {
    // Parse the JSON body from the incoming request
    const body = await request.json();
    console.log('The current body that i would like to send is ', body)
    const feedback ={
        sympy: body.sympyResponse,
        questionData: body.questionData

    }


    try {
        // Send the parsed body to the FastAPI server
        const response = await fetch('http://127.0.0.1:8000/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(feedback), // Send the body as JSON
        });

        // Parse the response from the FastAPI server
        const result = await response.json();

        return new Response(
            JSON.stringify({ message: 'completed', data: result }),
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        // Handle errors
        return new Response(
            JSON.stringify({ message: 'error', error: error.message }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            }
        );
    }
}
