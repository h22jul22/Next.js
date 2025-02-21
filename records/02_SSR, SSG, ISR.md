# Page Router

## Server-side Rendering (SSR)

페이지가 서버 사이드 렌더링(Server-side Rendering, SSR)을 사용한다면, 해당 페이지의 HTML은 **매 요청마다** 생성된다.

페이지에서 서버 사이드 렌더링을 사용하려면, `getServerSideProps`라는 비동기 함수를 export해야 하고, 이 함수는 매 요청마다 서버에서 호출된다.

```jsx
export async function getServerSideProps() {
    // 외부 API에서 데이터를 가져오기
    const res = await fetch(`https://.../data`);
    const data = await res.json();

    // `props`로 반환하여 Page 컴포넌트에서 사용 가능
    return { props: { data } };
}

export default function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    // 데이터 렌더링...
}
```

`getServerSideProps`는 `getStaticProps`와 유사하지만, 차이점은 `getServerSideProps`가 빌드 시점이 아니라 매 요청마다 실행된다는 것이다.

<br>

## Static Site Generation (SSG)

페이지가 **정적 생성(Static Generation)**을 사용하면, 해당 페이지의 HTML은 **빌드 시점**에 생성된다. 즉, 프로덕션 환경에서는 `next build` 명령을 실행할 때 페이지 HTML이 생성되며, 이후 요청이 들어올 때마다 이 HTML이 **재사용**된다. 또한, CDN에서 캐시될 수도 있다.

Next.js에서는 데이터가 있는 경우와 없는 경우 모두 정적으로 페이지를 생성할 수 있는데, 각각의 경우를 살펴보자.

### 데이터를 포함한 정적 생성

사전 렌더링 시 외부 데이터를 가져와야 하는 페이지의 경우, Next.js는 두 가지 기능을 제공한다.

**1. 페이지의 내용이 외부 데이터에 의존하는 경우 → `getStaticProps` 사용**

Next.js에서 `getStaticProps`라는 비동기 함수를 내보낼 수 있다. 이 함수는 빌드 시점에 호출되며, 가져온 데이터를 페이지의 props로 전달한다.

```jsx
export async function getStaticProps() {
    // 외부 API에서 게시글 데이터를 가져오기
    const res = await fetch('https://.../posts');
    const posts = await res.json();

    // `props`로 반환하여 Blog 컴포넌트에서 사용 가능
    return {
        props: {
            posts,
        },
    };
}

export default function Blog({ posts }) {
    // 게시글 목록 렌더링...
}
```

**2. 페이지의 경로(path)가 외부 데이터에 의존하는 경우 → `getStaticPaths` 사용 (일반적으로 `getStaticProps`와 함께 사용됨)**

Next.js에서는 동적 라우트를 생성할 수 있다. 예를 들어, 특정 블로그 게시글을 `id` 값을 기반으로 보여주려면 `pages/posts/[id].js` 파일을 만들 수 있는데, 이때 어떤 `id`를 사전 렌더링할지 결정해야 한다.

예를 들어, 데이터베이스에 `id: 1`인 게시글 하나만 존재한다면, 빌드 시점에 `/posts/1`만 사전 렌더링하면 된다. 이후 `id: 2` 게시글이 추가되면, `/posts/2`도 사전 렌더링하도록 변경해야 된다.

이를 처리하기 위해, Next.js에서는 동적 페이지에서 `getStaticPaths`라는 비동기 함수를 내보낼 수 있다. 이 함수는 빌드 시점에 실행되며, 어떤 경로를 사전 렌더링할지 지정한다.

```jsx
export async function getStaticPaths() {
  // 외부 API에서 게시글 목록 가져오기
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  // 가져온 게시글 데이터를 기반으로 사전 렌더링할 경로 생성
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  	// false: 404 Not Found 반환
    // blocking: 즉시 생성 (SSR)
    // true: 페이지 UI만 미리 반환 + 즉시 생성 (SSR)
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  // `params.id`를 기반으로 특정 게시글 데이터를 가져오기
  const res = await fetch(`https://.../posts/${context.params!.id}`);
  const post = await res.json();

  // `post` 데이터를 `props`로 전달
  return {
    props: {
        post
    },
  };
}

export default function Post({ post }) {
  // 게시글 내용 렌더링...
}
```

<br>

### 데이터 없이 정적 생성

기본적으로 Next.js는 별도의 데이터 요청 없이 정적 생성을 사용해 페이지를 사전 렌더링한다.

즉, 외부 데이터를 가져올 필요가 없어 `getServerSideProps`, `getStaticProps`를 사용하지 않아도, 기본적으로 SSG 방식이 적용되어 빌드 시점에 단일 HTML 파일로 생성된다.

<br>
