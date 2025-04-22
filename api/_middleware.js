export const config = {
    matcher: '/'
  };
  
  export default function middleware(request) {
    return new Response(JSON.stringify({ status: 'running' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }