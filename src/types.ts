export interface Category {
    id: string;
    title: string;
    content: string;
}

export interface Album {
    id: string;
    title: string;
    content: string;
}

export type NewCategory = Omit<Category, 'id'>