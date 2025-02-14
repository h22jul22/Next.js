'use client';

import style from './modal.module.css';
import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function Modal({ children }: { children: ReactNode }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
            dialogRef.current?.scrollTo({
                top: 0,
            });
        }
    }, []);

    return createPortal(
        <dialog
            className={style.modal}
            ref={dialogRef}
            onClose={() => {
                // esc 클릭 -> 뒤로가기
                router.back();
            }}
            onClick={(e) => {
                // 모달의 배경 클릭 -> 뒤로가기
                if ((e.target as any).nodeName === 'DIALOG') {
                    router.back();
                }
            }}>
            {children}
        </dialog>,
        document.getElementById('modal-root') as HTMLElement
    );
}
