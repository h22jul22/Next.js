import { ReactNode, useEffect, useState } from 'react';
import SearchableLayout from '../../components/searchable-layout';
import BookItem from '../../components/book-item';
import fetchBooks from '@/lib/fetch-books';
import { useRouter } from 'next/router';
import { BookData } from '@/types';

//? SSR 방식
// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//     const q = context.query.q;
//     const books = await fetchBooks(q as string);

//     return {
//         props: {
//             books,
//         },
//     };
// };

// export default function Page({ books }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//     return (
//         <div>
//             {books.map((book) => (
//                 <BookItem key={book.id} {...book} />
//             ))}
//         </div>
//     );
// }

//? SSG 방식
//? build 시점에서 미리 페이지를 불러올 수 없기 때문에 -> client 측에서 fetching
export default function Page() {
    const [books, setBooks] = useState<BookData[]>([]);

    const router = useRouter();
    const q = router.query.q;

    const fetchSearchResult = async () => {
        const data = await fetchBooks(q as string);
        setBooks(data);
    };

    useEffect(() => {
        if (q) {
            fetchSearchResult();
        }
    }, [q]);

    return (
        <div>
            {books.map((book) => (
                <BookItem key={book.id} {...book} />
            ))}
        </div>
    );
}

Page.getLayout = (page: ReactNode) => {
    return <SearchableLayout>{page}</SearchableLayout>;
};
