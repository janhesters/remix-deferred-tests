import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node'; // or cloudflare/deno
import { defer } from '@remix-run/node'; // or cloudflare/deno
import { Await, Form, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import {faker} from '@faker-js/faker';

const mediaFileId = 'clfy0h69a0016qzon6rua0iya';

export const loader = async ({}: LoaderArgs) => {
  const critical = await new Promise(resolve =>
    setTimeout(() => resolve('hello'), 1000),
  );
  const nonCricital = new Promise(resolve =>
    setTimeout(() => resolve('world'), 3000),
  );

  const photos = await fetch('https://jsonplaceholder.typicode.com/photos')
  .then(response => response.json())

  return defer({ critical, nonCricital, myThing: faker.helpers.arrayElement(photos).title });
};

export const action = async () => {
  return json({});
};

export default function PackageRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <main>
      <h2>This is the second stage.</h2>
      <p>{data.critical}</p>
      <p>My thing {data.myThing}</p>

      <Suspense fallback={<p>Loading package location...</p>}>
        <Await
          resolve={data.nonCricital}
          errorElement={<p>Error loading package location!</p>}
        >
          {nonCricital => <p>{nonCricital}</p>}
        </Await>
      </Suspense>

      <Form method="post" replace>
        <button type="submit">Submit</button>
      </Form>
    </main>
  );
}
