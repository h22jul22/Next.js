'use server';

import { revalidateTag } from 'next/cache';

export async function createReviewAction(formData: FormData) {
    const bookId = formData.get('bookId')?.toString();
    const content = formData.get('content')?.toString();
    const author = formData.get('author')?.toString();

    if (!content || !author) return;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`, {
            method: 'POST',
            body: JSON.stringify({ bookId, content, author }),
        });
        console.log(response.status);

        revalidateTag(`review-${bookId}`);
    } catch (error) {
        console.error(error);
        return;
    }
}

//? 다양한 재검증 방식
//? 1. 특정 주소의 해당하는 페이지만 재검증
// revalidatePath(`/book/${bookId}`);

//? 2. 특정 경로의 모든 동적 페이지를 재검증 (폴더나 파일경로로 입력)
// revalidatePath("/book/[id]", "page");

//? 3. 특정 레이아웃을 갖는 모든 페이지를 재검증
// revalidatePath("/(with-searchbar)", "layout");

//? 4. 모든 데이터 재검증
// revalidatePath("/", "layout");

//? 5. 태그값 기준, 데이터 캐시 재검증 (ReviewList 컴포넌트 참고)
// revalidateTag(`review-${bookId}`);

//! revalidatePath 주의사항
// 1. 서버측에서만 호출할 수 있는 메소드 (서버 액션 or 서버 컴포넌트 내부)
// 2. 해당 페이지를 전부 재검증 -> 해당 페이지 데이터 & 풀 라우트 캐시 전부 무효화 -> 데이터는 바로 캐시 & 풀 라우트 캐시는 다음번 접속시 생성
