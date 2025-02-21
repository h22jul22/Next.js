# Page Router

## Server-side Rendering (SSR)

페이지가 서버 사이드 렌더링(Server-side Rendering, SSR)을 사용한다면, 해당 페이지의 HTML은 매 요청마다 생성된다.

페이지에서 서버 사이드 렌더링을 사용하려면, `getServerSideProps`라는 비동기 함수를 export해야 하고, 이 함수는 매 요청마다 서버에서 호출된다.

```jsx
// This gets called on every request
export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(`https://.../data`);
    const data = await res.json();

    // Pass data to the page via props
    return { props: { data } };
}

export default function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // Render data...
}
```

<br>
