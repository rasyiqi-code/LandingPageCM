import { cache } from "react";

export interface PageSeo {
    path: string;
    title?: string;
    title_id?: string;
    description?: string;
    description_id?: string;
    keywords?: string;
    keywords_id?: string;
    ogImage?: string;
    ogImage_id?: string;
}

export const getPageSeo = cache(async (_path: string): Promise<PageSeo | null> => {
    return null;
});