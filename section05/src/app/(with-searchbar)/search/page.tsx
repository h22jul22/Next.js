import books from '@/mock/books.json';
import BookItem from '@/components/book-item';
import { BookData } from '@/types';

// searchParams: 페이지 컴포넌트에 자동으로 제공되는 현재 페이지의 쿼리 스트링
export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
    }>;
}) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${(await searchParams).q}`
    );
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
