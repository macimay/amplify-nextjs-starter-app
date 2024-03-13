import { type Schema } from "@/../amplify/data/resource";
export default function StableDiffusion({
  product,
}: {
  product: Schema["Product"] ;
}) {
  return (
    <div>
      <h1>Stable Diffusion</h1>
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
