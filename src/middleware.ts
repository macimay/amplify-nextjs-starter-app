import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "@/config";

import { NextRequest, NextResponse } from "next/server";

import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/server/amplifyServerInit";
import createIntlMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: "en",
  localeDetection: false,
  localePrefix: localePrefix,
});
export async function middleware(request: NextRequest) {
  const handleI18nRouting = createIntlMiddleware({
    locales: locales,
    defaultLocale: "en",
  });
  // if (request.nextUrl.pathname.indexOf("admin") > -1) {
  //   return NextResponse.next();
  // }
  const response = handleI18nRouting(request);
  // const response = NextResponse.next();
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });

  if (authenticated) {
    // return NextResponse.redirect(new URL(request.url));
    return response;
  } else if (request.nextUrl.pathname.indexOf("login") == -1) {
    console.log("redirecting to login:", request.nextUrl.pathname);

    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}
// Amplify.configure(amplifyconfig, { ssr: true });

// export function middleware(request: NextRequest) {
//   // Auth.currentAuthenticatedUser().then((user ) => {
//   const cache = createIntlCache();
//   const locale = request.cookies.get("locale")?.value || "en";
//   const intl = createIntl({ locale, messages: getRequestConfig }, cache);

//   // Pass the `intl` object to your pages as a prop
//   const props = { intl };

//   const currentUser = request.cookies.get("currentUser")?.value;

//   if (currentUser) {
//     return NextResponse.redirect(new URL(request.nextUrl, request.url));
//   }
//   return NextResponse.redirect(new URL("/en/login", request.url));
//   // }
// }

// export async function middleware(req: NextRequest) {
//   const { pathname, searchParams } = req.nextUrl;

//   // Assuming a simple way to determine if a user is authenticated (e.g., checking a cookie)
//   const isAuthed = req.cookies.get("authToken");

//   // Get the locale from the URL or default to 'en'
//   const locale = searchParams.get("locale") || "en";

//   console.log("locale", locale);

//   // Paths that require authentication
//   const protectedPaths = ["/dashboard"]; // Add more protected paths as needed

//   // Check if the path is protected and the user is not authenticated
//   if (
//     protectedPaths.some((path) => pathname.startsWith(`/${locale}${path}`)) &&
//     !isAuthed
//   ) {
//     // Redirect to the login page with the current locale
//     const url = req.nextUrl.clone();
//     url.pathname = `/${locale}/login`; // Adjust the login path as necessary
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(en|cn)/:path*",
    "/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)",
  ],
};
// function createIntlCache() {
//   throw new Error("Function not implemented.");
// }

// function createIntl(arg0: { locale: any; messages: any }, cache: void) {
//   throw new Error("Function not implemented.");
// }
