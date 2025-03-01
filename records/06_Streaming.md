스트리밍(Streaming)은 UI를 서버에서 점진적으로 렌더링할 수 있도록 해준다. 작업을 여러 개의 청크(chunk)로 나누어 준비되는 대로 클라이언트로 스트리밍한다. 이를 통해 전체 콘텐츠가 렌더링되기 전에 일부 페이지를 즉시 볼 수 있다.

Next.js의 App Router는 기본적으로 스트리밍을 지원한다. 이는 초기 페이지 로딩 성능을 향상시키고, 느린 데이터 페칭으로 인해 전체 경로의 렌더링이 지연되는 것을 방지할 수 있다.

라우트(route) 세그먼트의 스트리밍하려면 `loading.js` 파일과 React의 `Suspense`를 활용하여 UI 컴포넌트를 스트리밍할 수 있다.

## 페이지 스트리밍 (Route Segment Streaming)

```
/app
 ├── dashboard/
 │   ├── loading.js  // /dashboard 및 하위 경로 기본 로딩 UI
 │   ├── settings/
 │   │   ├── loading.js  // /dashboard/settings 전용 로딩 UI
 │   │   ├── page.js
 │   ├── profile/
 │   │   ├── page.js
```

```tsx
export default function Loading() {
    return <div>데이터를 불러오는 중입니다...</div>;
}
```

-   적용 대상: 전체 페이지의 일부(라우트 세그먼트)
-   사용 방법: `loading.js` 파일을 해당 경로에 추가하여 로딩 상태를 정의한다. 이 파일은 해당 세그먼트의 콘텐츠가 로드되기 전에 표시될 UI를 지정한다.
    -   상위 폴더의 `loading.js`는 **해당 경로뿐만 아니라 하위 경로에도 적용**된다.
    -   하위 경로에서 다른 `loading.js` 파일을 추가하면, 해당 경로에 맞는 로딩 UI를 적용할 수 있다.
-   특징:
    -   페이지의 일부를 먼저 렌더링하여 사용자가 빠르게 콘텐츠를 볼 수 있도록 한다.
    -   나머지 콘텐츠는 데이터가 준비되는 대로 클라이언트로 스트리밍된다.
    -   Next.js 15에서는 Partial Prerendering(PPR)을 도입하여, 정적 콘텐츠와 동적 콘텐츠를 결합한 하이브리드 렌더링이 가능하다.
-   주의사항:
    -   **비동기 페이지 컴포넌트에만** 스트리밍을 제공한다.
    -   페이지 컴포넌트에만 스트리밍을 적용할 수 있다. (레이아웃 or 일반적인 컴포넌트 -> `Suspense` 활용)
    -   쿼리 스트링이 변경될때는 트리거링되지 않는다.

<br>

## 컴포넌트 스트리밍 (Suspense)

```tsx
// app/product/page.tsx
import { Suspense } from 'react';
import Reviews from './Reviews';
import Loading from './Loading';

export default function ProductPage() {
    return (
        <div>
            <h1>제품 상세 페이지</h1>
            <p>이 제품은 최신 기술이 적용된 고급 제품입니다.</p>

            {/* 제품 리뷰를 스트리밍 (비동기 데이터 로딩) */}
            <Suspense fallback={<Loading />}>
                <Reviews />
            </Suspense>
        </div>
    );
}
```

-   적용 대상: 특정 UI 컴포넌트
-   사용 방법: React의 `Suspense` 컴포넌트로 **비동기 로딩이 필요한 컴포넌트**를 감싸고, `fallback` 속성을 통해 로딩 중 표시할 UI를 지정한다.
-   특징:
    -   **각 컴포넌트별로 로딩 상태를 관리**할 수 있다.
    -   데이터나 코드 스플리팅을 통해 지연 로딩되는 컴포넌트에 유용하다.
    -   Next.js 15에서는 React 19와의 호환성을 지원하여, Suspense를 통한 스트리밍이 더욱 원활해졌다.
-   주의사항:
    -   기본적으로 쿼리 스트링이 변경될때는 트리거링되지 않는다.
    -   그러나 **`Suspense` 컴포넌트에 `key` 속성을 설정하면 쿼리 스트링 변경 시 렌더링이 트리거**된다. (`key` 속성을 변경하면 React는 기존 컴포넌트를 제거하고 새로운 컴포넌트를 마운트하기 때문에 쿼리 스트링이 변경될 때 자동으로 리렌더링이 트리거됨)

```tsx
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    return (
        <Suspense key={(await searchParams).q} fallback={<BookListSkeleton />}>
            <SearchResult />
        </Suspense>
    );
}
```

<br>

## 비교

| 비교 항목       | **페이지 스트리밍**                                     | **컴포넌트 스트리밍**                                 |
| --------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| **적용 대상**   | 전체 페이지의 일부 (라우트 세그먼트)                    | 특정 UI 컴포넌트                                      |
| **사용 방법**   | `loading.js` 파일 사용                                  | `Suspense` 컴포넌트 사용                              |
| **렌더링 순서** | 페이지 일부를 먼저 렌더링하고, 나머지를 점진적으로 로딩 | 각 컴포넌트별로 로딩 상태를 관리하며, 준비되면 렌더링 |
| **사용 사례**   | 페이지 전환 시 로딩 UI 제공                             | 제품 리뷰, 댓글, 추천 목록 등 개별 UI 요소 지연 로딩  |
| **서버 지원**   | Next.js App Router 기본 지원                            | React 19 및 Next.js 15에서 지원                       |
| **장점**        | 초기 로딩 속도 개선, 전체 페이지 렌더링 최적화          | 특정 데이터가 늦게 준비되더라도 페이지를 먼저 표시    |
| **한계점**      | 세부적인 컴포넌트 단위의 로딩 제어가 어려움             | 페이지 전체의 로딩 속도를 직접적으로 개선하지 않음    |
