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

## ✅ Data Cache (데이터 캐시)

### ✔️ Data Cache 작동방식

`fetch()`를 사용하여 캐시를 활성화할 수 있으며, 동일한 요청은 다시 실행되지 않고 캐시된 응답이 반환된다.

```jsx
async function getData() {
    const res = await fetch('https://example.com/api/data', { cache: 'force-cache' });
    return res.json();
}
```

1. `fetch`렌더링 중에 옵션이 포함된 요청이 처음 `'force-cache'`호출되면 Next.js는 캐시된 응답이 있는지 데이터 캐시를 확인한다.
2. 캐시된 응답이 발견되면 즉시 반환되고 메모화된다.
3. 캐시된 응답이 없으면 데이터 소스에 요청이 이루어지고, 결과는 데이터 캐시에 저장되고 메모화된다.
4. 캐시되지 않은 데이터(예: `cache`옵션이 정의되지 않았거나 를 사용하지 않음 `{ cache: 'no-store' }`)의 경우 결과는 항상 데이터 소스에서 가져와서 메모화된다.
5. 데이터가 캐시되든 캐시되지 않든, 요청은 항상 메모화되어 React 렌더 단계 중에 동일한 데이터에 대한 중복 요청이 발생하지 않도록 한다.

### ✔️ On-demand Revalidation (주문형 재검증) 작동방식

`next.revalidate` 옵션을 사용하면 일정 시간마다 새로운 데이터를 가져오도록 설정할 수 있다.

```jsx
async function getData() {
    const res = await fetch('https://example.com/api/data', { next: { revalidate: 60 } });
    return res.json();
}
```

1. `fetch()` 요청이 처음 호출될 때, 외부 데이터 소스에서 데이터를 가져와 데이터 캐시(Data Cache) 에 저장된다.
2. 주문형 재검증이 트리거되면 해당 캐시 항목이 캐시에서 제거된다 `PURGE`.
3. 이는 시간 기반 재검증(Time-based Revalidation) 과는 다르다.
    - 시간 기반 재검증은 새로운 데이터가 가져와질 때까지 기존(오래된) 데이터를 유지하지만,
    - 주문형 재검증은 즉시 캐시를 무효화하고 새 데이터를 요청하도록 한다.
4. 이후 동일한 요청이 발생하면 캐시 `MISS`가 발생하며, 외부 데이터 소스에서 다시 데이터를 가져와 데이터 캐시에 저장한다.

### ✔️ Data Cache 특징

-   백엔드 서버로부터 불러온 데이터를 거의 영구적으로 보관하기 위해 사용된다.
-   서버 가동중에는 영구적으로 보관된다.

<br>

## ✅ Full Route Cache (전체 경로 캐시)

Next.js는 **정적 페이지(Static Pages)**를 생성할 때 전체 페이지를 **빌드 타임(또는 재검증 시)**에 렌더링하고 캐싱하여 빠르게 제공할 수 있도록 한다. 이렇게 하면 매 요청마다 서버에서 다시 렌더링하는 대신 미리 캐싱된 경로를 제공할 수 있어 페이지 로딩 속도가 빨라진다.

### ✔️ Full Route Cache의 작동 방식

1. 정적 경로가 생성될 때(Static Rendering)

    - Next.js는 `HTML`과 `RSC Payload`를 서버 캐시에 저장
    - 이후 동일한 요청이 들어오면 캐시된 데이터를 즉시 반환

2. 사용자가 페이지 요청

    - 정적 경로일 경우 → 캐시된 `HTML`과 `RSC Payload` 반환 (SSG)
    - 동적 경로일 경우 → 서버에서 다시 렌더링 후 반환 (SSR)

3. 데이터 재검증(Revalidation) 또는 배포 발생 (ISR )
    - 캐시가 무효화되며 새로운 요청 시 최신 데이터로 업데이트됨

즉, Full Route Cache는 SSG(정적 생성)된 페이지를 캐싱하고, SSR(동적 요청)된 페이지는 캐싱 없이 렌더링하며, ISR(점진적 재생성)된 페이지는 특정 조건에서 캐시를 업데이트하는 방식으로 동작한다.

### ✔️ Full Route Cache 특징

-   **정적 페이지(Static Pages)**에만 Full Route Cache가 적용된다.
-   빌드 타임(정적 생성 시) 또는 데이터 재검증(Revalidation) 후 페이지를 캐싱한다.
-   배포 또는 데이터 재검증 시 캐시가 자동 삭제된다.

<br>
