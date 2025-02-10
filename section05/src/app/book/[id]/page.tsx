import { notFound } from 'next/navigation';
import style from './page.module.css';

// generateStaticParams에서 명시한 params 외에는 notFound로 설정하기
// export const dynamicParams = false;

// 정적인 파라미터를 생성하는 함수 (페이지 라우터의 getStaticPaths)
// 빌드타임에 정적 파라미터에 해당하는 페이지를 만들어 놓는다 -> 풀 라우트 캐시
export function generateStaticParams() {
    return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

// params: 페이지 컴포넌트에 자동으로 제공되는 현재 페이지의 URL 파라미터 값
export default async function Page({ params }: { params: Promise<{ id: string | string[] }> }) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${(await params).id}`
    );
    if (!response.ok) {
        if (response.status === 404) {
            notFound();
        }
        return <div>오류가 발생했습니다...</div>;
    }

    const book = await response.json();
    const { title, subTitle, description, author, publisher, coverImgUrl } = book;

    return (
        <div className={style.container}>
            <div
                className={style.cover_img_container}
                style={{ backgroundImage: `url('${coverImgUrl}')` }}>
                <img src={coverImgUrl} />
            </div>
            <div className={style.title}>{title}</div>
            <div className={style.subTitle}>{subTitle}</div>
            <div className={style.author}>
                {author} | {publisher}
            </div>
            <div className={style.description}>{description}</div>
        </div>
    );
}
