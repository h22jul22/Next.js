import style from './global-layout.module.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function GlobalLayout({ children }: { children: ReactNode }) {
    return (
        <div className={style.container}>
            <header className={style.header}>
                <Link href={'/'}>📚 ONEBITE BOOKS</Link>
            </header>
            <main className={style.main}>{children}</main>
            <footer className={style.footer}>제작 @h22ju</footer>
        </div>
    );
}
