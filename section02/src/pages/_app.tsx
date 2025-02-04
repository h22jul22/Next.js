import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import GlobalLayout from './components/global-layout';
import { ReactNode } from 'react';
import { NextPage } from 'next';

// 기존 Next.js에서 제공하는 NextPage 타입에 getLayout 메소드 타입 추가
type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactNode) => ReactNode;
};

// AppProps 타입 확장
export default function App({
    Component,
    pageProps,
}: AppProps & {
    Component: NextPageWithLayout;
}) {
    // const router = useRouter();

    // const moveToTestPage = () => {
    //     router.push('/test');
    // };

    // 프로그레매틱하게 이동하는 페이지 명시적 prefetching
    // useEffect(() => {
    //     router.prefetch('/test');
    // }, []);

    //console.log(Component.getLayout);
    const getLayout = Component.getLayout ?? ((page: ReactNode) => page);

    return <GlobalLayout>{getLayout(<Component {...pageProps} />)}</GlobalLayout>;
}
