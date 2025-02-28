Next.js에서는 성능을 개선하고 비용을 줄이기 위해 다양한 캐시를 지원한다. Request Memoization (요청 메모이제이션), Data Cache (데이터 캐시), Full Route Cache (전체 경로 캐시), Client Router Cache (클라이언트 라우터 캐시)를 통해 Next.js의 캐싱 메커니즘, 이를 구성하는 데 사용할 수 있는 API, 이들이 서로 상호 작용하는 방식에 대해 자세히 살펴보자.

## ✅ Request Memoization (요청 메모이제이션)

Next.js는 동일한 요청을 한 번만 수행하도록 자동으로 메모이제이션(기억)한다.
예를 들어, `fetch`를 **동일한 URL로 여러 번 호출하면 Next.js는 한 번만 요청을 수행**하고, 그 결과를 **재사용**한다.

```jsx
async function getData() {
    const res = await fetch('https://example.com/api/data');
    return res.json();
}

// getData()를 여러 번 호출해도 Next.js는 동일한 요청을 중복 수행하지 않는다.
export default async function Page() {
    const data1 = await getData(); // 실제 요청 수행
    const data2 = await getData(); // 캐시된 결과를 사용

    return <div>{data1.someValue}</div>;
}
```

### ✔️ Request Memoization 작동방식

1. 경로를 렌더링하는 동안 특정 요청이 처음 호출되면 결과는 메모리에 저장되지 않고 캐시에 저장된다 `MISS`.
2. 따라서 해당 함수가 실행되고, 외부 소스에서 데이터를 가져오고, 그 결과가 메모리에 저장된다.
3. 동일한 렌더 패스에서 요청에 대한 후속 함수 호출은 캐시가 되고 `HIT`, 함수를 실행하지 않고도 메모리에서 데이터가 반환된다.
4. 경로가 렌더링되고 렌더링 패스가 완료되면 메모리가 '재설정'되고 모든 요청 메모 항목이 지워진다.

### ✔️ Request Memoization 특징

-   **하나의 페이지를 렌더링 하는 동안**에 중복된 API 요청을 캐싱하기 위해 존재한다.
-   렌더링이 종료되면 모든 캐시가 소멸된다.

App Router에서는 React Server Component의 도입으로 각각의 컴포넌트에서 데이터를 직접 요청할 수 있게 되었다. 때문에 하나의 페이지에서 여러 컴포넌트가 존재하는 경우에, 서로 다른 컴포넌트에서 동일한 데이터를 필요로 하는 경우가 발생할 수 밖에 없어졌다.

이를 위해서 Next.js 동일한 요청을 한 번만 수행하도록 **자동**으로 메모이제이션하고, 이는 동일한 데이터 요청을 중복으로 보내는 것을 방지하여 성능을 최적화한다.

<br>
