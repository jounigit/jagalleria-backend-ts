export enum Role {
    Editor = 'editor',
    Admin = 'admin'
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
    categories?: Category[];
    albums?: Album[];
    pictures?: Picture[];
}

export interface BaseModel {
    id: string;
    title: string;
    slug?: string;
    content?: string;
    user: string;
}
export interface Category extends BaseModel {
    albums?: Album[];
}

export interface Album extends BaseModel {
    category?: Category;
    pictures?: Picture[];
}

export interface Picture extends BaseModel {
    image: string;
    thumb: string;
    landscape: string;
    publicID: string;
    publicIDThumb: string;
}

export type NewAlbum = Omit<Album, 'id'>
export type NewCategory = Omit<Category, 'id'>