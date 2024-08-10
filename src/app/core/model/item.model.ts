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
}
