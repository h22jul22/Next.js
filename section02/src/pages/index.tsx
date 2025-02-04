import style from './index.module.css';
import { ReactNode } from 'react';
import SearchableLayout from './components/searchable-layout';

export default function Home() {
    return <h1 className={style.title}>인덱스</h1>;
}

Home.getLayout = (page: ReactNode) => {
    return <SearchableLayout>{page}</SearchableLayout>;
};
