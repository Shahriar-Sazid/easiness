import { Pagination } from "../model/pagination.model";

export function paginate({ page, pageSize }: Pagination) {
    page ||= 1
    pageSize ||= 10
    return { skip: (+page - 1) * +pageSize, take: +pageSize }
}