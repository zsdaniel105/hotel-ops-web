import { authenticate } from "@/server/auth"; import { getCloudflareEnv } from "@/server/cloudflare"; import { errorResponse } from "@/server/errors";
export async function GET(request:Request){try{const user=await authenticate(request,getCloudflareEnv());return Response.json({user});}catch(error){return errorResponse(error)}}
