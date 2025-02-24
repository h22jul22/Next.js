App Router를 학습하면서 React Server Component 개념이 등장했다. 앞으로 정리하게 될 내용은 App Router에만 해당되는 내용이다.

## React Server Component는 무엇인가?

먼저 서버 컴포넌트가 나오게 된 이유를 살펴보자.

Next.js에서는 사전 렌더링 방식을 제공한다. Page Router에서는 사전 렌더링을 위해 렌더링 된 HTML을 브라우저에 제공한다. 이후에 JS Bundle 파일을 후속으로 보내준다. 이 과정에서 해당 페이지의 모든 컴포넌트를 JS Bundle로 보내주게 되는데, 여기서 **Page Router의 단점**을 알 수 있다.

**해당 페이지의 모든 컴포넌트가 JS Bundle에 포함**된다는 점이다.

이렇게만 보면 JS Bundle에 포함이 되지 않는 컴포넌트가 있어도 되나 싶다. 나는 지금까지 리액트를 사용해 오면서 모든 파일을 다 JS Bundle로 받아보기 때문에 그 방식에 이미 익숙하기 때문이다.

하지만 가만히 살펴보면, JS가 필요하지 않은 컴포넌트들이 더 많이 존재한다. 모든 페이지에서 모든 기능이 사용자와 상호작용이 필요한건 아니기 때문이다.

이런 점을 활용해서 App Router에서는 브라우저(클라이언트)에서 필요하지 않은 컴포넌트는 서버 컴포넌트로 분리한다. 서버 컴포넌트는 사전 렌더링시 서버측에서 한번만 실행되고, JS Bundle에 포함되지 않는다.

즉, **브라우저(클라이언트)에서 필요한 컴포넌트만 JS Bundle에 포함**함으로서 JS Bundle의 용량을 줄이고, Hydration 시간도 줄이는 엄청난 효과를 볼 수 있다.

이렇게 등장하게 된게 React Server Component 이다.

<br>

## React Server Component 주의사항

**1. 서버 컴포넌트에는 브라우저에서 실행될 코드가 포함되면 안된다.**

React Server Component는 서버 측에서만 실행되는 컴포넌트이기 때문에 브라우저 측에서 동작하는 `useState`, `useEffect`와 같은 React Hooks나 `onClick`, `onChange` 등의 이벤트 핸들러들은 서버 컴포넌트에서는 사용될 수 없다.

**2. 클라이언트 컴포넌트는 클라이언트에서만 실행되는 것이 아니다.**

-   사전 렌더링을 위해 서버에서 1번 실행
-   Hydration을 위해 브라우저에서 1번 실행

**3. 클라이언트 컴포넌트에서 서버 컴포넌트를 import 할 수 없다.**

```jsx
// src/components/ClientComponent
'use client';

import ServerComponent from './server-component.tsx';

export default function ClientComponent() {
    return <ServerComponent />;
}
```

`ClientComponent`는 서버 측에서 실행될 때에는 문제가 발생하지 않는다. 이 두 컴포넌트의 코드가 다 존재하기 때문에 `ClientComponent`에서 `ServerComponent`를 import 해서 실행시킬 수 있다.

하지만 반대로 브라우저에서 Hydration을 위해 한번 더 실행이 될 때에는
`ServerComponent`가 존재하지 않는다. 그렇기 때문에 `ClientComponent`에서 `ServerComponent`를 import 할 수 없다.

Next.js는 이럴 때 오류를 발생시키는 대신에 그냥 서버 컴포넌트를 클라이언트 컴포넌트로 바꿔주게 된다. 즉 `"use client"` 디렉티브가 없어도 자동으로 클라이언트 컴포넌트로 바뀌어 버린다.

하지만 이런 현상은 바람직하지 않다. 왜냐하면 클라이언트 컴포넌트가 많아지면 JS Bundle의 용량도 커지기 때문에 최대한 많은 서버 컴포넌트로 유지시키는 것이 좋기 때문이다. 지금처럼 이런 불필요한 컴포넌트가 클라이언트 컴포넌트로 바뀌는 것은 좋은 상황이 아니다.

그렇다면 이런 상황에서는 어떻게 해결할 수 있을까? 클라이언트 컴포넌트가 서버 컴포넌트를 반드시 자식으로 둬야 하는 경우가 된다면, import가 아닌 children props로 받아서 렌더링을 시켜주는 방법이 있다.

```jsx
// src/components/ClientComponent
"use client";

export default function ClientComponent({children}:{children: ReactNode}) {
	return <div>{children}</div>
}

// src/app/page.tsx
export default function Home() {
	return (
      <ClientComponent>
        <ServerComponent />
      </ClientComponent>
    )
}
```

`ServerComponent` 결과물을 children이라는 props로 전달받도록 구조가 변경되었다. 이제 넥스트는 브라우저에서는 이 서버 컴포넌트를 실행할 필요가 없어졌기 때문에 서버 컴포넌트를 클라이언트 컴포넌트로 변경하지 않는다.

**4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 Props는 전달할 수 없다.**

서버 컴포넌트들을 실행 시키면 그 결과로 HTML 태그가 바로 실행되는 것이 아니라 RSC Payload 라는 JSON과 비슷한 형태의 문자열이 생성된다. RSC(React Server Component) Payload란 React Server Component를 직렬화한 결과이다.

RSC Payload에는 서버 컴포넌트와 관련된 모든 데이터가 다 들어있다. 구체적으로는 서버 컴포넌트의 렌더링 결과, 서버 컴포넌트와 연결된 클라이언트 컴포넌트들의 위치 또는 이 서버 컴포넌트가 현재 클라이언트에게 전달하고 있는 props의 값 등이 있다.

여기서 주의해야할 점은, 서버 컴포넌트들을 실행해서 RSC Payload라는 형태로 직렬화하는 과정에서 특정 서버 컴포넌트가 자신의 자식인 클라이언트 컴포넌트에게 직렬화가 불가능한(예: 함수) 형태의 값을 props로 전달하고 있다면 런타임 에러가 발생하게 된다.

그렇기 때문에 서버 컴포넌트에서 클라이언트 컴포넌트에게 함수처럼 직렬화가 불가능한 값은 props로 보내줄 수 없다는 점을 주의하자.
