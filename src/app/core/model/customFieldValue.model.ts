export interface CustomFieldValue {
    value: any | null;
    customFieldId: string;
    itemId: string;
}

export interface CustomFieldValueResponse {
    id: string;
    value: string;
    customFieldId: string;
    itemId: string;
    customFieldName: string;
    fieldType: string;
}

export interface updateCustomFieldValueRequest   {
    "id": string,
    "value": any | null,
    "customFieldId": string,
    "itemId": string
  }