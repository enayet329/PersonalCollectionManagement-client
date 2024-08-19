export interface AddTagRequest {
    name: string,
    itemId: string,
}

export interface AddTagResponse {
    id: string,
    name: string,
  }

export interface UpdateTagRequest {
    id: string,
    name: string,
}
