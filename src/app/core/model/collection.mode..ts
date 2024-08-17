export interface Collection {
  createdDate: string | number | Date;
  id: string;
  name: string;
  description: string;
  topic: string;
  imageUrl: string;
  userId: string;
  userName: string;
  itemCount: number;
}

export interface AddCollectionRequest {
  name: string;
  description: string;
  topic: string;
  imageUrl: string;
  userId: string;
}

export interface UpdateCollectionRequest {
  id: string;
  name: string;
  description: string;
  topic: string;
  imageUrl: any | null;
  userId: string;
}