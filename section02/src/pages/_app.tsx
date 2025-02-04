import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const moveToTestPage = () => {
        router.push('/test');
    };

    // 프로그레매틱하게 이동하는 페이지 명시적 prefetching
    useEffect(() => {
        router.prefetch('/test');
    }, []);

    return (
        <>
            <header>
                <Link href={'/'}>index</Link>
                <Link href={'/search'} prefetch={false}>
                    search
                </Link>
                <Link href={'/book/1'}>book/1</Link>
                <div>
                    <button onClick={moveToTestPage}>test 페이지로 이동</button>
                </div>
            </header>
            <Component {...pageProps} />
        </>
    );
}
