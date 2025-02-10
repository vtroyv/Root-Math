import { createUser } from "@/lib/mongodb/utils";

export async function POST(request){
    const body = await request.json()
    try{
        console.log('Testing creating the user in the database, the body is ', body )
        const result = await createUser(body)
        return new Response(
            JSON.stringify({message:"Test complet- It's a success", result}),
            {
                headers: {'Content-Type':'application/json'}
            }
        
        );
    } catch(error) {
        return new Response(JSON.stringify({message:'error', error: error.message}), 
            {
                headers:{'Content-Type':'application/json'},
                status:500
            }
        )
    }

}