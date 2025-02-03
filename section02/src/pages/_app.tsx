import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    const moveToTestPage = () => {
        router.push('/test');
    };
    return (
        <>
            <header>
                <Link href={'/'}>index</Link>
                <Link href={'/search'}>search</Link>
                <Link href={'/book/1'}>book/1</Link>
                <div>
                    <button onClick={moveToTestPage}>test 페이지로 이동</button>
                </div>
            </header>
            <Component {...pageProps} />
        </>
    );
}
