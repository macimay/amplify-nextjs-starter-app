export default function Home({ params }: { params: { productId: string } }) {
  return (
    <div>
      <h1>Home</h1>
      <p>
        This is a Next.js project with TypeScript, ESLint, Prettier, and
        Tailwind CSS.
        {params.productId}
      </p>
    </div>
  );
}
