# Page Router

Next.js Page Router에서는 `<Head>` 컴포넌트를 사용하여 HTML 문서의 `<title>` 태그 및 기타 **메타데이터**를 수정할 수 있다.

> ✅ 페이지 제목(`<title>`)을 동적으로 변경 가능
> ✅ SEO 및 Open Graph 메타 태그 수정 가능
> ✅ Next.js에서 올바르게 메타데이터가 업데이트되도록 설정 가능

### Next.js의 `<Head>` 컴포넌트

`next/head`에서 제공하는 `<Head>` 컴포넌트를 import해서 사용하면 된다.

-   일반적인 `<head>` 태그 대신 `<Head>`**(대문자) 컴포넌트**를 사용한다.
-   `<Head>`를 사용하면 Next.js 페이지 내에서 **메타데이터를 동적으로 업데이트**할 수 있다.

**📝 1. 메인 페이지의 제목(`<title>`)과 Open Graph 메타 태그를 설정해보자.**

```jsx
// pages/index.tsx
import Head from 'next/head';

export default function Home({
    allBooks,
    recoBooks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <Head>
                <title>한입북스</title>
                <meta property='og:image' content='/thumbnail.png' />
                <meta property='og:title' content='한입북스' />
                <meta property='og:description' content='한입 북스에 등록된 도서들을 만나보세요' />
            </Head>
            <div className={style.container}>// ...</div>
        </>
    );
}
```

**📝 2. 이번엔 동적 페이지의 제목(`<title>`)과 Open Graph 메타 태그를 설정해보자.**

```jsx
// pages/book/[id].tsx
export default function Page({ book }: InferGetStaticPropsType<typeof getStaticProps>) {
    const { title, subTitle, description, author, publisher, coverImgUrl } = book;

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property='og:image' content={coverImgUrl} />
                <meta property='og:title' content={title} />
                <meta property='og:description' content={description} />
            </Head>
            <div className={style.container}>// ...</div>
        </>
    );
}
```

<br>
