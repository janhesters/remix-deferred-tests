import type { LoaderArgs } from '@remix-run/node'; // or cloudflare/deno
import { defer } from '@remix-run/node'; // or cloudflare/deno
import { Await, Outlet, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

export const loader = async ({}: LoaderArgs) => {
  const critical = await new Promise(resolve =>
    setTimeout(() => resolve('hello'), 1000),
  );
  const nonCricital = new Promise(resolve =>
    setTimeout(() => resolve('world'), 10_000),
  );

  return defer({ critical, nonCricital });
};

export default function PackageRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>Let's locate your package</h1>
      <p>{data.critical}</p>

      <Suspense fallback={<p>Loading package location...</p>}>
        <Await
          resolve={data.nonCricital}
          errorElement={<p>Error loading package location!</p>}
        >
          {nonCricital => <p>{nonCricital}</p>}
        </Await>
      </Suspense>

      <Outlet />
    </main>
  );
}
