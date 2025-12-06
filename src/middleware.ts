import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Create a response object taaki yha se response mile
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Setup Supabase Client yhi sab karega main vcheez
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  
  const { data: { user } } = await supabase.auth.getUser();

  
  if (!user && request.nextUrl.pathname !== "/login" && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If LOGGED IN, and trying to go to login page toh dikkat na ho 
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|auth).*)",
  ],
};