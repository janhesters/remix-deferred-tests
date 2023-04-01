import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url).pathname;
  return redirect(url + '/foo');
};
