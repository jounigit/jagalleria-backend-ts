export enum IRole {
    Editor = 'editor',
    Admin = 'admin'
}

export interface IUser {
    id: string;
    username: string;
    email: string;
    role: IRole;
    categories: Array<string>;
    albums: Array<string>;
    pictures: Array<string>;
}

export interface BaseModel {
    id: string;
    title: string;
    slug: string;
    content?: string;
    user: string;
}
export interface ICategory extends BaseModel {
    albums: Array<string>;
}

export interface IAlbum extends BaseModel {
    category?: string;
    pictures: Array<string>;
}

export interface IPicture extends BaseModel {
    image: string;
    thumb: string;
    landscape: string;
    publicID: string;
    publicIDThumb: string;
}

export type INewAlbum = Omit<IAlbum, 'id'>
export type INewCategory = Omit<ICategory, 'id'>