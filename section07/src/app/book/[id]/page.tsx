import { notFound } from 'next/navigation';
import style from './page.module.css';
import { ReviewData } from '@/types';
import ReviewItem from '@/components/review-item';
import { ReviewEditor } from '@/components/review-editor';

// 라우트 세그먼트 옵션
export const dynamicParams = true;
// 1. true: 기본값, generateStaticParams에서 명시한 params 외에는 dynamic 하게 데이터 페칭
// 2. false: generateStaticParams에서 명시한 params 외에는 notFound로 설정

// 정적인 파라미터를 생성하는 함수 (페이지 라우터의 getStaticPaths)
// 빌드타임에 정적 파라미터에 해당하는 페이지를 만들어 놓는다 -> 풀 라우트 캐시 적용
export function generateStaticParams() {
    return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

async function BookDetail({ bookId }: { bookId: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`);
    if (!response.ok) {
        if (response.status === 404) {
            notFound();
        }
        return <div>오류가 발생했습니다...</div>;
    }

    const book = await response.json();
    const { title, subTitle, description, author, publisher, coverImgUrl } = book;

    return (
        <section>
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
        </section>
    );
}

async function ReviewList({ bookId }: { bookId: string }) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
        {
            next: { tags: [`review-${bookId}`] },
        }
    );

    if (!response.ok) {
        throw new Error(`Review fetch failed: ${response.statusText}`);
    }

    const reviews: ReviewData[] = await response.json();
    return (
        <section>
            {reviews.map((review) => (
                <ReviewItem key={`review-item-${review.id}`} {...review} />
            ))}
        </section>
    );
}

// params: 페이지 컴포넌트에 자동으로 제공되는 현재 페이지의 URL 파라미터 값
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className={style.container}>
            <BookDetail bookId={(await params).id} />
            <ReviewEditor bookId={(await params).id} />
            <ReviewList bookId={(await params).id} />
        </div>
    );
}
