"use client";

import "@aws-amplify/ui-react/styles.css";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";

function Login() {
  return (
    <main>
      <h1>Hello login </h1>
      <button> Sign out</button>
      <div className="flex mr-10 mt-10 bg-red-500 justify-end">
        <Authenticator></Authenticator>
      </div>
    </main>
  );
}
// export default withAuthenticator(Login);
export default Login;
