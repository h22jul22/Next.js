# Page Router

Next.js Page Router에서는 `<Head>` 컴포넌트를 사용하여 HTML 문서의 `<title>` 태그 및 기타 메타데이터를 수정할 수 있다.

> -   페이지 제목(`<title>`)을 동적으로 변경 가능
> -   SEO 및 Open Graph 메타 태그 수정 가능
> -   Next.js에서 올바르게 메타데이터가 업데이트되도록 설정 가능

### ✅ Next.js의 `<Head>` 컴포넌트

`next/head`에서 제공하는 `<Head>` 컴포넌트를 import해서 사용하면 된다.

-   일반적인 `<head>` 태그 대신 `<Head>`**(대문자) 컴포넌트**를 사용한다.
-   `<Head>`를 사용하면 Next.js 페이지 내에서 **메타데이터를 동적으로 업데이트**할 수 있다.

**📝 1. 정적 페이지의 제목(`<title>`)과 Open Graph 메타 태그를 설정해보자.**

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

![](https://velog.velcdn.com/images/h22ju/post/e6753626-af19-47b0-9c17-2ab38417b24f/image.png)

**📝 2. 이번엔 동적 페이지의 제목(`<title>`)과 Open Graph 메타 태그를 설정해보자**

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

![](https://velog.velcdn.com/images/h22ju/post/28ba2379-ac11-4747-a1c7-ce96a08ff903/image.png)

<br>
<hr>

# App Router

Next.js App Router에서는 Metadata API를 사용해서 `<head>` 요소 내의 `<title>` 태그 및 기타 메타데이터를 정의할 수 있다.

### ✅ 설정 기반 메타데이터 (Config-based Metadata)

`layout.js` 또는 `page.js` 파일에서 정적인 `metadata` 객체를 내보내거나, 동적인 `generateMetadata` 함수를 사용하여 메타데이터를 정의할 수 있다.

**📝 1. 정적 페이지의 제목(`<title>`)과 Open Graph 메타 태그를 설정해보자.**

정적 메타데이터를 정의하려면 `layout.tsx` 또는 `page.tsx` 파일에서 `Metadata` 객체를 내보내면 된다.

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '한입 북스',
    description: '한입 북스에 등록된 도서를 만나보세요',
    openGraph: {
        title: '한입 북스',
        description: '한입 북스에 등록된 도서를 만나보세요',
        images: ['/thumbnail.png'],
    },
};

export default function Page() {}
```

**📝 2. 이번엔 동적 페이지의 제목(`<title>`)과 Open Graph 메타 태그를 설정해보자**

`generateMetadata` 함수를 사용하면 동적으로 변경되는 값(예: API에서 가져온 데이터)을 기반으로 메타데이터를 생성할 수 있다.

```tsx
export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`, {
        cache: 'force-cache',
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const book: BookData = await response.json();

    return {
        title: `${book.title} - 한입 북스`,
        description: `${book.description}`,
        openGraph: {
            title: `${book.title} - 한입 북스`,
            description: `${book.description}`,
            images: [book.coverImgUrl],
        },
    };
}
```

<br>

### ✅ 파일 기반 메타데이터 (File-based Metadata)

경로 세그먼트에 특정 파일을 추가하여 정적 또는 동적으로 메타데이터를 제공할 수 있다. 이 파일들은 정적 메타데이터로 사용될 수 있으며, 필요하면 코드로 동적으로 생성할 수도 있다.

| 파일명                                      | 설명                    |
| ------------------------------------------- | ----------------------- |
| `favicon.ico`, `apple-icon.jpg`, `icon.jpg` | 아이콘 관련 메타데이터  |
| `opengraph-image.jpg`, `twitter-image.jpg`  | 소셜 미디어 공유 이미지 |
| `robots.txt`                                | 크롤러 지침 파일        |
| `sitemap.xml`                               | 사이트맵 파일           |
