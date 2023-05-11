import type { APIRoute } from 'astro'

// #vercel-disable-blocks
import { fetch, ProxyAgent } from 'undici'
// #vercel-end

const baseUrl = (import.meta.env.OPENAI_API_BASE_URL || 'https://api.openai.com').trim().replace(/\/$/,'')
const httpsProxy = import.meta.env.HTTPS_PROXY
export const post: APIRoute = async (context) => {

  const body = await context.request.json()
  let {  key } = body
  if (!key){
     key = import.meta.env.OPENAI_API_KEY??""
  }



  let requestBody:RequestInit={
    headers: {
      Authorization: `Bearer ${key}`,
    },
    method: 'GET'
    }
  // #vercel-disable-blocks
  if (httpsProxy) {
    requestBody['dispatcher'] = new ProxyAgent(httpsProxy)
  }
  // #vercel-end

  // @ts-ignore
  const response = await fetch(`${baseUrl}/dashboard/billing/credit_grants`, requestBody) as Response
  if(response.statusText!='OK'){
    return response.json().catch(err => {
    }).then(parsedValue => {
      return  new Response(JSON.stringify(parsedValue), {
        status: 401,
        statusText: 'Unauthorized',
        headers: {
          'Content-Type': 'text/plain'
        }
      })
    });
  }else {
    return response.json().then(data=>{
      return new Response(JSON.stringify(data))
    })
  }
}
