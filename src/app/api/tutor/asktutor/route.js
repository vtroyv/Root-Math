export async function POST(request){
    const body = await request.json();
    console.log('The current body that i would like to send is ', body)
    
    
    try{
        const response = await fetch('http://127.0.0.1:8000/ask-tutor', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })

        console.log('The response from the server is ', response)
        

        const result = 'succss';
        return new Response(
            JSON.stringify({message: 'completed', data: result}),
            {
                headers: {'Content-Type': 'application/json'},
            }
        );
    } catch (error){
        return new Response(
            JSON.stringify({message: 'error', error: error.message}),
            {
                headers: {'Content-Type': 'application/json'},
                status: 500,
            }
        );
    }

}