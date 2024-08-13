export interface CustomField {
    name: string;
    filedType: string;
    collectionId: string;
}

export interface CustomFieldResponse {
    id: string;
    name: string;
    fieldType: string;
    collectionId: string;
    customFieldValues: any[];
}