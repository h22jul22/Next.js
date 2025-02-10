import BookItem from '@/components/book-item';
import style from './page.module.css';
import books from '@/mock/books.json';
import { BookData } from '@/types';

async function AllBooks() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/random`);
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
