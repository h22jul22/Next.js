## ✅ Server Actions 란?

Server Actions는 Next.js 애플리케이션에서 **폼 제출 및 데이터 변조를 처리하기 위해 서버에서 실행되는 비동기 함수**이다. 이러한 함수는 서버 및 클라이언트 컴포넌트 모두에서 호출될 수 있다.

Server Actions를 사용하면 **클라이언트와 서버 간의 복잡한 데이터 요청 흐름을 단순화**할 수 있다. 이를 통해 서버에서 처리해야할 작업들을 클라이언트 코드에서 분리하고, 클라이언트에서 서버 함수를 간편하게 호출할 수 있다.

<br>
<hr>

## ✅ Server Actions를 사용하는 이유

### ✔️ 기존 API 호출 방식과의 비교

Server Actions는 Next.js 15에서 도입된 기능으로, 서버에서 실행되는 비동기 함수이다. React에서 API 호출을 통해 서버와 데이터를 주고받던 기존 방식과 비교하면, Server Actions는 데이터 요청 및 변조 흐름을 보다 단순하게 만들 수 있다. 이를 통해 개발자가 서버와 클라이언트 간의 데이터 전달 방식에서 불필요한 복잡성을 줄이고, 보안과 성능을 개선할 수 있다.

### ✔️ 기존 API 호출 방식의 문제점

**1. 불필요한 네트워크 요청**

-   `useEffect`를 사용할 경우, 클라이언트에서 초기 렌더링 시 불필요한 네트워크 요청이 발생할 수 있음.
-   특히, SSR(Server-Side Rendering) 환경에서 서버에서 이미 데이터를 가져왔음에도 클라이언트에서 다시 요청하는 문제가 발생할 수 있음.

**2. 상태 관리의 복잡성 증가**

-   API 응답 데이터를 `useState`에 저장하고, 이를 기반으로 UI를 갱신해야 함.
-   캐싱, 비동기 처리, 에러 핸들링 등을 추가로 고려해야 하므로 코드가 복잡해짐.
-   `react-query`와 같은 별도의 라이브러리를 도입해야 할 수도 있음.

**3. 보안 취약점**

-   클라이언트에서 API를 직접 호출하는 경우, API 엔드포인트가 브라우저에 노출됨.
-   API 요청을 가로채거나 변조할 위험이 있으며, 인증 및 권한 관리를 강화해야 함.

**4. 폼 제출 후 리디렉션 처리의 어려움**

-   기존 방식에서는 폼을 제출한 후 상태를 업데이트하고, `router.push` 등을 이용해 다른 페이지로 이동해야 함.
-   클라이언트와 서버 간 상태 동기화가 필요해 복잡성이 증가함.

### ✔️ Server Actions를 사용하는 이유

Server Actions를 활용하면 위와 같은 문제점을 해결하고, 보다 직관적인 데이터 요청 흐름을 구현할 수 있다.

**1. 네트워크 요청 최소화**

-   클라이언트에서 직접 API를 호출하지 않고, 서버에서 필요한 데이터를 즉시 처리하여 반환함.
-   서버 컴포넌트 내에서 실행되므로, 불필요한 네트워크 왕복을 줄이고 성능을 개선할 수 있음.

**2. 상태 관리 간소화**

-   `useState`나 `useEffect` 없이 Server Actions에서 데이터를 직접 처리할 수 있음.
-   `react-query` 같은 상태 관리 라이브러리 없이도 비즈니스 로직을 서버에서 직접 실행할 수 있음.

**3. 보안 강화**

-   API 엔드포인트가 브라우저에서 노출되지 않으므로, 클라이언트에서 직접 호출할 수 없음.
-   중요한 로직을 클라이언트에서 실행하는 대신, 서버에서 실행하여 보안성을 높일 수 있음.

**4. 직관적인 데이터 요청 흐름**

-   Server Actions는 `use server` 지시어를 사용하여 함수 내에서 서버에서 실행됨.
-   데이터를 받아오는 과정이 더욱 직관적이며, 불필요한 코드가 줄어듦.

**5. 폼 제출과 리디렉션을 간편하게 처리**

-   Server Actions는 폼의 `action` 속성에 직접 사용할 수 있어, `onSubmit` 이벤트 핸들러를 별도로 정의할 필요 없음.
-   폼 제출 후 자동으로 서버에서 데이터가 처리되며, 리디렉션을 쉽게 적용할 수 있음.

```tsx
async function submitForm(formData: FormData) {
    'use server';
    // 데이터 저장 및 리디렉션
    redirect('/success');
}

return <form action={submitForm}>...</form>;
```

<br>
<hr>

## ✅ Server Actions이 필요하지 않은 경우

Server Actions는 강력한 기능이지만, 모든 경우에 필요한 것은 아니다. 다음과 같은 경우에는 기존 방식이 더 적절할 수 있다.

**1. 실시간 데이터가 필요한 경우**

-   웹소켓이나 `react-query` 같은 클라이언트 캐싱 솔루션이 적절한 경우.
-   예를 들어, 주기적으로 갱신되는 대시보드나 채팅 애플리케이션에서는 클라이언트 측 폴링이 필요할 수도 있음.

**2. 브라우저에서 직접 처리해야 하는 작업**

-   파일 업로드 및 다운로드 같은 클라이언트 측에서 실행하는 것이 성능상 더 나은 작업.
-   예를 들어, 이미지 미리보기 같은 기능은 브라우저에서 직접 처리하는 것이 효율적임.

**3. 다른 API 호출이 필요한 경우**

-   Server Actions는 주로 Next.js 내부에서 서버 상태를 다루는 용도로 적합하며, 외부 API와의 직접적인 통합에는 적절하지 않을 수 있음.
-   예를 들어, 여러 API 엔드포인트를 조합하는 경우 혹은 OAuth 인증, 결제 시스템과 같이 특정한 API 호출 흐름이 필요한 경우에는 API Routes를 통해 별도로 처리하는 것이 유리함.

<br>
<hr>

## ✅ 컨벤션

Server Action은 React의 `"use server"` 지시어를 사용하여 정의할 수 있다. `async` 함수의 상단에 이 지시어를 추가하여 해당 함수를 Server Action으로 표시하거나, 파일 상단에 지시어를 추가하여 해당 파일의 모든 내보내기를 Server Action으로 지정할 수 있다.

### ✔️ 서버 컴포넌트에서의 사용

서버 컴포넌트에서는 인라인 함수 레벨 또는 모듈 레벨에서 `"use server"` 지시어를 사용할 수 있다. 인라인으로 Server Action을 추가하려면, 함수 본문 상단에 `"use server"`를 추가하면 된다.

```tsx
// app/page.tsx
export default function Page() {
    // Server Action
    async function create() {
        'use server';
        // 데이터 변조 로직
    }

    return '...';
}
```

### ✔️ 클라이언트 컴포넌트에서의 사용

클라이언트 컴포넌트에서 Server Action을 호출하려면, **새로운 파일을 생성**하고 파일 상단에 `"use server"` 지시어를 추가한다. 이 파일 내의 모든 함수는 서버 및 클라이언트 컴포넌트에서 재사용할 수 있는 Server Actions로 표시된다.

```tsx
// app/actions.ts

'use server';

export async function create() {
    // 데이터 변조 로직
}
```

```tsx
// app/ui/button.tsx

'use client';

import { create } from '@/app/actions';

export function Button() {
    return <button onClick={create}>Create</button>;
}
```

### ✔️ Props로 액션 전달하기

Server Action을 클라이언트 컴포넌트에 prop으로 전달할 수 있다.

```tsx
<ClientComponent updateItemAction={updateItem} />
```

```tsx
// app/client-component.tsx

'use client';

export default function ClientComponent({
    updateItemAction,
}: {
    updateItemAction: (formData: FormData) => void;
}) {
    return <form action={updateItemAction}>{/* ... */}</form>;
}
```

<br>
<hr>

## ✅ 예시

### ✔️ Forms

서버 액션을 사용하여 폼 데이터를 처리하는 예시이다.

```tsx
// app/invoices/page.tsx

export default function Page() {
    async function createInvoice(formData: FormData) {
        'use server';

        const rawFormData = {
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
        };

        // 데이터 변조 로직
        // 캐시 재검증 로직
    }

    return (
        <form action={createInvoice}>
            <input name='customerId' type='text' placeholder='Customer ID' />
            <input name='amount' type='number' placeholder='Amount' />
            <input name='status' type='text' placeholder='Status' />
            <button type='submit'>Create Invoice</button>
        </form>
    );
}
```

### ✔️ Programmatic form submission

`requestSubmit()` 메서드를 사용하여 Programmatic하게 폼 제출을 트리거하는 예시이다.

```tsx
// app/entry.tsx

'use client';

import { useRef } from 'react';

export default function EntryForm() {
    const formRef = useRef<HTMLFormElement>(null);

    async function saveEntry(formData: FormData) {
        'use server';
        // 데이터 저장 로직
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            formRef.current?.requestSubmit();
        }
    }

    return (
        <form ref={formRef} action={saveEntry} onKeyDown={handleKeyDown}>
            <textarea name='content' placeholder='Write your entry...' />
            <button type='submit'>Save Entry</button>
        </form>
    );
}
```

### ✔️ Pending states

리액트 18버전에서 추가 된 `useFormStatus` 훅을 사용하여 폼의 로딩 상태를 표시하는 예시이다.

```tsx
// components/SubmitButton.tsx

'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export default function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type='submit' disabled={pending}>
            {pending ? 'Submitting...' : 'Submit'}
        </button>
    );
}
```

```tsx
// app/form/page.tsx

import SubmitButton from '@/components/SubmitButton';

export default function FormPage() {
    async function handleSubmit(formData: FormData) {
        'use server';
        // 폼 데이터 처리 로직
    }

    return (
        <form action={handleSubmit}>
            <input name='username' type='text' placeholder='Username' />
            <SubmitButton />
        </form>
    );
}
```

<br>
<hr>

## ✅ 결론

Server Actions는 기존의 클라이언트 API 호출 방식이 가지는 복잡성과 보안 문제를 해결할 수 있는 강력한 기능이다.

이를 사용하면 **네트워크 요청을 최소화**하고, **상태 관리를 단순화**하며, **보안을 강화**할 수 있다. 또한, 폼 제출 및 데이터 변조와 같은 기능을 간편하게 구현할 수 있어 Next.js 기반 애플리케이션의 개발 생산성을 크게 향상시킨다.

React에서 API 호출을 직접 수행하던 방식과 비교했을 때, Server Actions는 더욱 효율적이고 보안성이 높은 대안이 될 수 있다. 이를 적절히 활용하면 서버와 클라이언트 간 데이터 흐름을 단순화하면서도 성능과 유지보수성을 개선할 수 있다.
