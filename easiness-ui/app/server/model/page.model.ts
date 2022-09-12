import { SelectQueryBuilder } from "typeorm";

export type Page<T> = {
    content: T[];
    totalElements: number;
    size: number;
    number: number;
}

export type Pagination = {
    page: string | number;
    pageSize: string | number;
}

export function paginate({ page, pageSize }: Pagination) {
    page ||= 1
    pageSize ||= 10
    return { skip: (+page - 1) * +pageSize, take: +pageSize, page }
}

export async function getPage<T>(query: SelectQueryBuilder<T>, pagination: Pagination) {
    const { skip, take, page } = paginate(pagination);
    return {
        content: await query
            .skip(skip)
            .take(take)
            .getMany(),
        size: take,
        number: page,
        totalElements: await query
            .getCount()
    } as Page<T>
}