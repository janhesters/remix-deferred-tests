import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node'; // or cloudflare/deno
import { defer } from '@remix-run/node'; // or cloudflare/deno
import { Await, Form, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import {faker} from '@faker-js/faker';
import { myTest } from '~/features/my-feature.server';

export const loader = async ({}: LoaderArgs) => {
  console.log('loading critical foo', new Date().toISOString());
  const critical = await new Promise(resolve =>
    setTimeout(() => resolve('hello'), 500),
    );
    console.log('loaded critical foo', new Date().toISOString());
  // console.log('non critical')
  // new Promise(resolve =>
  //   setTimeout(() => {
  //     console.log('resolved first');
  //     resolve('foo')
  //   }, 3000),
  // )
  // const nonCritical = fetch('https://jsonplaceholder.typicode.com/todos/').then(response => response.json()).then(json => new Promise(resolve =>
  // setTimeout(() => {
  //   console.log('resolved');
  //   resolve(json)
  // }, 3000),
// ))
const nonCritical = myTest();
console.log('non critical', nonCritical)

  const photos = await fetch('https://jsonplaceholder.typicode.com/photos')
  .then(response => response.json())
  
  console.log('deferring', new Date().toISOString())
  return defer({ critical, nonCritical, myThing: faker.helpers.arrayElement(photos).title });
};

export const action = async () => {
  return json({});
};

export default function PackageRoute() {
  console.log('rendering', new Date().toISOString())
  const data = useLoaderData<typeof loader>();
  console.log('data', data);

  return (
    <main>
      <h2>This is the second stage.</h2>
      <p>{data.critical}</p>
      <p>My thing {data.myThing}</p>

      <Suspense fallback={<p>Loading package location...</p>}>
        <Await
          resolve={data.nonCritical}
          errorElement={<p>Error loading package location!</p>}
        >
          {nonCritical => <p>{nonCritical[0].title}</p>}
        </Await>
      </Suspense>

      <Form method="post" replace>
        <button type="submit">Submit</button>
      </Form>
    </main>
  );
}
