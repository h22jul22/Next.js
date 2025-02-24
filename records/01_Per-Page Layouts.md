Next.js를 학습하면서 배운 내용을 정리하고 기록하고자 한다.

Page Router와 App Router를 동시에 같이 학습하다보니 헷갈리는 부분이 많다. 그렇다보니 아무래도 각각의 차이를 정리하는 글을 많이 작성하게 되지 않을까싶다.

오늘은 페이지별 레이아웃 설정하는 방법을 Page Router와 App Router에서 각각 어떻게 구현할 수 있는지 정리해보고자 한다.

## Page Router

```jsx
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

export default function Page() {
  return (
    /** Your content */
  )
}

Page.getLayout = function getLayout(page: ReactNode) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}
```

```jsx
// 기존 Next.js에서 제공하는 NextPage 타입에 getLayout 메소드 타입 추가
type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactNode) => ReactNode,
};

export default function MyApp({
    Component,
    pageProps,
}: AppProps & {
    Component: NextPageWithLayout,
}) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

    return getLayout(<Component {...pageProps} />);
}
```

-   여기서 `Page` 컴포넌트는 함수이다. **자바스크립트에서 함수는 객체**이므로 `getLayout`이라는 메서드를 생성할 수 있다.
-   `getLayout` 메서드로 페이지 역할을 하는 컴포넌트(`Page`)를 전달받아서 레이아웃을 적용해서 리턴하도록 만든다.
-   `MyApp`컴포넌트에서 `getLayout` 메서드를 불러와서 호출하는 형태로 별도의 레이아웃을 적용할 수 있다.

위의 방식을 간단하게 정리해보자면,

페이지 역할을 하는 컴포넌트(`Page`)에 새로운 메서드를 만들고, 각 페이지 컴포넌트에서 그 메서드를 갖고있으면 레이아웃이 적용되고, 갖고있지 않다면 레이아웃이 적용되지 않는것이다.

그렇기 때문에 레이아웃을 적용해야하는 각 페이지 컴포넌트에 `getLayout` 메서드를 일일이 만들어 줘야한다. ~~이 작업은 꽤나 번거롭다고 생각한다...~~

<br>

## App Router

그렇다면 App Router에서는 페이지별 레이아웃을 어떻게 설정할 수 있을까? 개인적으로 Page Router의 번거로움을 해결한 방법이 나와있기를 기대해본다.

**✔️ App Router 규칙**

```
app
 ├── layout.tsx   (루트 레이아웃)
 ├── page.tsx     ("/" 홈 페이지)
 ├── about
 │   ├── page.tsx ("/about" 페이지)
 ├── blog
 │   ├── page.tsx ("/blog" 페이지)
```

-   `page.tsx` → 해당 디렉토리의 루트 경로를 담당하는 페이지 파일
-   `layout.tsx` → 여러 페이지에서 **공통 UI를 제공하는 레이아웃** 파일
-   `app/` 내부의 `page.tsx` 파일을 자동으로 라우트로 인식

해당 디렉토리에 `layout.tsx` 파일을 생성하면 UI를 제공하는 레이아웃이 자동으로 적용된다. 아니, 이렇게나 편리해졌다고? ~~감탄...~~

이제 이렇게 생성한 레이아웃 파일을 어떻게 적용하는지 알아보자.

```jsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body>
                <nav>
                    <a href='/'>Home</a>
                    <a href='/about'>About</a>
                </nav>
                <main>{children}</main>
            </body>
        </html>
    );
}
```

-   모든 페이지(`page.tsx`)는 자동으로 `layout.tsx`를 감싸는 구조가 됨
-   `children` 프로퍼티를 사용하여 페이지(`page.tsx`) 콘텐츠가 `<main>` 태그 안에 렌더링됨
-   공통 UI(예: 내비게이션 바, 푸터 등)는 모든 페이지에서 유지됨

이번에는 중첩 레이아웃(Nested Layouts)인 경우에는 어떻게 적용할 수 있는지 알아보자.

```
app
 ├── layout.tsx       (루트 레이아웃) --- 1
 ├── page.tsx         ("/" 홈 페이지)
 ├── dashboard
 │   ├── layout.tsx   (대시보드 전용 레이아웃) --- 2
 │   ├── page.tsx     ("/dashboard" 페이지)
 │   ├── analytics
 │   │   ├── page.tsx ("/dashboard/analytics" 페이지)
```

```jsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <h1>Dashboard</h1>
            {children}
        </section>
    );
}
```

이제 `/dashboard`와 `/dashboard/analytics` 페이지는 **1. 루트 레이아웃 외에도 2. `DashboardLayout`이 추가 적용**된다.

그렇다면 이번에는 위의 Page Router의 예시와 같이 레이아웃을 적용해야하는 특정 페이지들이 있다면, 이 경우에는 어떻게 해야할지 알아보자.

```
app
 ├── layout.tsx       (루트 레이아웃)
 ├── (with-dashboard)
 │   ├── dashboard
 │   │   ├── page.tsx ("/dashboard" 페이지)
 │   ├── layout.tsx   (홈과 대시보드 페이지 공용 레이아웃)
 │   ├── page.tsx     ("/" 홈 페이지)
 ├── posts
 │   ├── page.tsx ("/posts" 페이지)
```

Next.js App Router에서는 특정 폴더를 **"경로 그룹(Route Group)"** 으로 설정하면, 해당 폴더가 URL 경로에서 제외된다. 이게 무슨 말이냐? URL 구조에 영향을 주지 않고 관련된 경로들을 논리적으로 정리할 수 있다.

위의 예시를 보면 `/` 홈 페이지와 `/dashboard` 페이지에만 `DashboardLayout`을 적용하고 싶은 경우, `(with-dashboard)`라는 폴더를 생성해서 `/` 홈 페이지와 `/dashboard` 페이지를 묶는다. 그리고 ` layout.tsx`를 생성하면 특정(`/` 홈 페이지와 `/dashboard` 페이지) 페이지들에만 레이아웃을 적용할 수 있다.

**✔️ 경로 그룹(Route Group) 규칙**

-   경로 그룹을 만들려면 폴더 이름을 괄호(`()`)로 감싸면 된다.

**✔️ 경로 그룹(Route Groups)의 주요 기능**

-   경로를 논리적으로 그룹화 (사이트 섹션별, 목적별, 팀별 정리 가능)
-   동일한 URL 경로 안에서도 여러 개의 중첩 레이아웃 생성 가능
-   공통 경로 안에서 일부 경로에만 특정 레이아웃 적용 가능
-   특정 경로에만 로딩 스켈레톤(loading.tsx) 추가 가능

레이아웃을 설정해보며 Page Router와 App Router를 비교해보니, Page Router에서는 번거롭게 설정해야했던 부분을 App Router에서 확실히 편리하고 직관적으로 설정할 수 있게 변경된게 느껴졌다.

그래도 리액트만 써왔던 나에게는 Next.js의 파일 기반 라우팅 시스템은 Page Router와 App Router 모두 무척이나 편리하게 느껴진다.
