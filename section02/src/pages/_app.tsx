import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import GlobalLayout from './components/global-layout';

export default function App({ Component, pageProps }: AppProps) {
    // const router = useRouter();

    // const moveToTestPage = () => {
    //     router.push('/test');
    // };

    // 프로그레매틱하게 이동하는 페이지 명시적 prefetching
    // useEffect(() => {
    //     router.prefetch('/test');
    // }, []);

    return (
        <GlobalLayout>
            <Component {...pageProps} />
        </GlobalLayout>
    );
}
