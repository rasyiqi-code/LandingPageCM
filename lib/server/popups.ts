export interface PopUp {
    id: string;
    headline: string;
    headline_id?: string;
    description: string;
    description_id?: string;
    ctaText?: string;
    ctaText_id?: string;
    ctaUrl?: string;
    isActive: boolean;
    targetingType?: string;
    targetingPaths: string[];
    targetingLocales: string[];
    showFormLead: boolean;
    delay: number;
}

export const getActivePopUps = async (): Promise<PopUp[]> => {
    return [];
};

export const getPopUps = async (): Promise<PopUp[]> => {
    return [];
};