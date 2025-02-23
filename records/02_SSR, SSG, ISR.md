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

### 데이터 없이 정적 생성

기본적으로 Next.js는 별도의 데이터 요청 없이 정적 생성을 사용해 페이지를 사전 렌더링한다.

즉, 외부 데이터를 가져올 필요가 없어 `getServerSideProps`, `getStaticProps`를 사용하지 않아도, 기본적으로 SSG 방식이 적용되어 빌드 시점에 단일 HTML 파일로 생성된다.

<br>

## Incremental Static Regeneration (ISR)

ISR(Incremental Static Regeneration)은 정적 생성된 페이지를 전체 사이트를 다시 빌드하지 않고도 업데이트할 수 있도록 해준다.

> ✅ 전체 사이트를 다시 빌드하지 않고도 정적 콘텐츠 업데이트 가능
> ✅ 미리 렌더링된 정적 페이지를 제공하여 서버 부하 감소
> ✅ 적절한 캐시 제어(Cache-Control) 헤더 자동 설정
> ✅ 대량의 콘텐츠 페이지를 효과적으로 처리하여 `next build` 시간이 길어지는 문제 해결

위의 SSG 예시에서 60초마다 캐시를 무효화하고 새로운 데이터를 가져오려면, `getStaticProps` 함수의 리턴 값으로 `props` 바깥에 `revalidate` 이라는 프로퍼티를 추가해주면 된다.

```jsx
export async function getStaticProps(context: GetStaticPropsContext) {
  const res = await fetch(`https://.../posts/${context.params!.id}`);
  const post = await res.json();

  // `post` 데이터를 `props`로 전달
  return {
    props: {
        post
    },
	// 60초마다 캐시를 무효화하고 새로운 데이터를 가져옴
    revalidate: 60,
  };
}

```

### On-Demand Revalidation (res.revalidate())

Next.js에서는 즉시 페이지를 다시 생성(revalidate)할 수 있도록 API 라우트를 활용한 **온디맨드(요청시, 주문시) 검증** 기능을 제공한다. 이를 사용하면 특정 페이지를 **필요할 때만** 다시 생성할 수 있다.

> ✅ getStaticProps에서 revalidate 시간을 지정할 필요 없음
> ✅ API 요청을 통해 특정 페이지를 수동으로 갱신 가능
> ✅ 불필요한 재생성을 방지하여 성능 최적화
> ✅ 보안 토큰을 활용해 승인된 요청만 허용

**1. API 라우트에서 `res.revalidate()` 사용하기**

```jsx
// pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 요청이 올바른지 확인하기 위해 secret token 검증
    if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        // 다시 생성할 경로 지정 ("/posts/[id]" → 실제 경로 "/posts/1")
        await res.revalidate('/posts/1');
        return res.json({ revalidated: true });
    } catch (err) {
        // 오류 발생 시, Next.js는 마지막으로 성공한 페이지를 계속 제공
        return res.status(500).send('Error revalidating');
    }
}
```

**2. API 호출로 페이지 재검증 실행**

```jsx
fetch('/api/revalidate?secret=your-secret-token')
    .then((res) => res.json())
    .then((data) => console.log(data));
```

**3. `getStaticProps`에서 `revalidate` 생략 가능**

온디맨드 방식에서는 `getStaticProps`에서 `revalidate` 시간을 설정할 필요가 없다. Next.js는 기본값인 false(자동 재생성 없음)을 사용하며, `res.revalidate()`가 호출될 때만 페이지를 다시 생성한다.

```jsx
export async function getStaticProps() {
    const res = await fetch('https://.../posts/1');
    const post = await res.json();

    return {
        props: { post },
        // `revalidate` 지정 필요 없음 (res.revalidate()로 처리)
    };
}
```

**🔎 `res.revalidate()`가 유용한 경우**

-   관리자가 블로그 게시글을 업데이트할 때만 새로 고치고 싶을 때
-   제품 상세 페이지를 새로 등록/수정할 때만 변경 사항을 반영하고 싶을 때
-   댓글, 리뷰 등 특정 데이터가 업데이트될 때만 정적 페이지를 새로 만들고 싶을 때
-   CDN 캐시를 불필요하게 무효화하지 않도록 최적화하고 싶을 때

<br>
