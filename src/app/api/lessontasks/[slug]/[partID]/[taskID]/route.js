
export async function POST(request, {params}) {
    const paramsObj = await params
    console.log('The params object is ', paramsObj)
    

    const body = await request.json();
    console.log('The current body that i would like to send is ', body)

    return new Response(JSON.stringify({feedback:'testing if feedback will send', correct:true}))
}

/* 
Here you will need 


*/