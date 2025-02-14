export default function Loading() {
    return <div>/search page loading.tsx</div>;
}

//! loading.tsx 주의사항
// 1. 동일한 경로에 있는 페이지뿐만 아니라 해당하는 경로 아래에 있는 모든 페이지 컴포넌트들이 스트리밍된다.
// 2. 비동기 페이지 컴포넌트에만 스트리밍을 제공한다.
// 3. 페이지 컴포넌트에만 스트리밍을 적용할 수 있다. (레이아웃 or 일반적인 컴포넌트 -> Suspense 활용)
// 4. 쿼리스트링이 변경될때는 트리거링되지 않는다.
