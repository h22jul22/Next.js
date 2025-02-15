import { delay } from '@/util/delay';

export default async function Page() {
    await delay(2000);
    return <div>setting page</div>;
}

// 1. 동일한 경로에 있는 페이지뿐만 아니라 해당하는 경로 아래에 있는 모든 페이지 컴포넌트들이 스트리밍된다.
// 2. 비동기 페이지 컴포넌트에만 스트리밍을 제공한다.
