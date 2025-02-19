Next.js를 학습하면서 배운 내용을 정리하고 기록하고자 한다.

Page Router와 App Router를 한번에 같이 학습하다보니 헷갈리는 부분이 많다. 그렇다보니 아무래도 각각의 차이를 정리하는 글을 많이 작성하게 되지 않을까싶다.

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

## App Router

그렇다면 App Router에서는 페이지별 레이아웃을 어떻게 설정할 수 있을까? 개인적으로 Page Router의 번거로움을 해결한 방법이 나와있기를 기대해본다.

(예정)
