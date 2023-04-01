import axios from "axios";

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function myTest() {
  console.log('clicked', new Date().toISOString());
  await wait(1000);
  console.log('waited 2 seconds');
  const unanswered = Array.from({ length: 200 }, () => ({
    question: 'foo',
  }));
  await Promise.all(
    unanswered.map(({ question }) =>
      // retrieveEmbeddingFromS3ByUrl(question.embeddingsUrl),
      axios.get('https://jsonplaceholder.typicode.com/photos'),
    ),
  );
  console.log('starting my test', new Date().toISOString());
  await wait(2000);
  console.log('waited 2 seconds once');
  await Promise.all([wait(2000), wait(2000)]);
  console.log('waited 2 seconds again');
  return [{title: 'loaded'}];
}