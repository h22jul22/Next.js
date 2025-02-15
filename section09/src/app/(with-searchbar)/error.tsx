'use client'; // 오류는 클라이언트, 서버측에서 모두 발생할 수 있기 때문에 -> 어떤 환경에서도 대응할 수 있게 하기위해서

import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h3>오류가 발생했습니다...</h3>
            <button
                onClick={() => {
                    startTransition(() => {
                        router.refresh(); // 현재 페이지에 필요한 서버컴포넌트들을 다시 불러옴 (refresh() -> 비동기적으로 동작하는 메소드)
                        reset(); // 에러 상태를 초기화하고, 컴포넌트들을 다시 렌더링 -> 페이지를 복구
                    });
                }}>
                다시 시도
            </button>
        </div>
    );
}

//! error.tsx 주의사항
// 1. 동일한 경로에 있는 페이지뿐만 아니라 해당하는 경로 아래에 있는 모든 페이지에 에러 핸들링이 적용된다.
// 2. 특정 페이지에서 별도의 에러 핸들링을 원하면 그 페이지에서 error.tsx를 생성하면 된다.
// 3. 같은 경로에 있는 layout까지만 렌더링 한다.
