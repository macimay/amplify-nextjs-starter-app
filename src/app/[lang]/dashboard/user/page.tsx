"use client";
export default function UserHome() {
  return (
    <div>
      <h1>User Home</h1>
      <p>
        This page uses the <code>getServerSideProps</code> function to fetch
        data from an API.
      </p>
      <p>
        The data is fetched server-side and will be rendered to HTML before the
        page is served.
      </p>
    </div>
  );
}
