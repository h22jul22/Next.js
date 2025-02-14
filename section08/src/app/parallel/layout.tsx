import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({
    children,
    sidebar,
    feed,
}: {
    children: ReactNode;
    sidebar: ReactNode;
    feed: ReactNode;
}) {
    return (
        <>
            <div>
                <Link href={'/parallel'}>/parallel</Link>
                <br />
                <Link href={'/parallel/setting'}>/parallel/setting</Link>
            </div>
            <br />
            <div>
                {sidebar}
                {feed}
                {children}
            </div>
        </>
    );
}
