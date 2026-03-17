export interface Category {
    id: number;
    name: string;
    image: string;
    slug: string;
}

export interface UpsertCategoryRequest {
    name: string;
    image: string;
}
