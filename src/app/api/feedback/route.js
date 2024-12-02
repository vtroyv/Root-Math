export async function POST(request) {
    
    
    // Parse the JSON body
    const body = await request.json();
    console.log(body)

    return new Response(JSON.stringify({ message: 'completed', data: body }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
