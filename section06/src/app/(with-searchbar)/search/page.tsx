import BookItem from '@/components/book-item';
import BookListSkeleton from '@/components/skeleton/book-list-skeleton';
import { BookData } from '@/types';
import { delay } from '@/util/delay';
import { Suspense } from 'react';

async function SearchResult({ q }: { q: string }) {
    // 스트리밍을 위한 비동기 딜레이 설정
    await delay(1500);
    // 동적 함수(쿼리스트링)로 페이지 캐시 불가능 -> 데이터 캐시를 최대한 활용 -> 검색 결과 캐시
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`, {
        cache: 'force-cache',
    });
    if (!response.ok) {
        return <div>오류가 발생했습니다...</div>;
    }

    const books: BookData[] = await response.json();
    return (
        <div>
            {books.map((book) => (
                <BookItem key={book.id} {...book} />
            ))}
        </div>
    );
}

// searchParams: 페이지 컴포넌트에 자동으로 제공되는 현재 페이지의 쿼리 스트링
export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
    }>;
}) {
    return (
        <Suspense key={(await searchParams).q} fallback={<BookListSkeleton count={1} />}>
            <SearchResult q={(await searchParams).q || ''} />
        </Suspense>
    );
}
