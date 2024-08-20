export interface Item {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  dateAdded: string;
  collectionName: string;
  collectionId: string;
  tagNames: string[] | null;
  likes: number;
  userId: string;
}

export interface AddItem{
  "name": "",
  "imgUrl": string,
  "description": "",
  "collectionId": ""
}

export interface UpdateItem{
  "id": any,
  "name": any,
  "imgUrl": any,
  "description": any,
  "collectionId": any
}