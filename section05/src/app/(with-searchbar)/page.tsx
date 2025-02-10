import BookItem from '@/components/book-item';
import style from './page.module.css';
import { BookData } from '@/types';

// 라우트 세그먼트 옵션
export const dynamic = 'auto';
// dynamic: 특정 페이지의 유형을 강제로 Static, Dynamic 페이지로 설정
// 1. auto: 기본값, 아무것도 강제하지 않음
// 2. force-dynamic: 페이지를 강제로 Dynamic 페이지로 설정
// 3. force-static: 페이지를 강제로 Static 페이지로 설정
// 4. error: 페이지를 강제로 Static 페이지로 설정 -> Static으로 설정하면 안되는 이유가 있다면 빌드 오류 발생

async function AllBooks() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`, {
            cache: 'force-cache',
        });
        const allBooks: BookData[] = await response.json();
        return (
            <div>
                {allBooks.map((book) => (
                    <BookItem key={book.id} {...book} />
                ))}
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>오류가 발생했습니다...</div>;
    }
}

async function RecoBooks() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`, {
            next: { revalidate: 3 },
        });
        const recoBooks: BookData[] = await response.json();
        return (
            <div>
                {recoBooks.map((book) => (
                    <BookItem key={book.id} {...book} />
                ))}
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>오류가 발생했습니다...</div>;
    }
}

export default function Home() {
    return (
        <div className={style.container}>
            <section>
                <h3>지금 추천하는 도서</h3>
                <RecoBooks />
            </section>
            <section>
                <h3>등록된 모든 도서</h3>
                <AllBooks />
            </section>
        </div>
    );
}
