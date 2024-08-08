const apiUrl = 'http://localhost:7138/api/v1/';

export const CollectionConstants = {
  API_ENDPOINTS: {
    GET_COLLECTIONS: apiUrl + 'collections',
    GET_LARGEST_COLLECTIONS: apiUrl + 'collections/largest',
    ADD_COLLECTION: apiUrl + 'collections/add',
    DELETE_COLLECTION: apiUrl + 'collections/delete/id',
    GET_COLLECTION_BY_ID: apiUrl + 'collections/get/id',
    GET_COLLECTIONS_BY_USER_ID: apiUrl + 'collections/get/userId',
    UPDATE_COLLECTION: apiUrl + 'collections/update/id'
  }
};


export const ItemConstants = {
  API_ENDPOINTS: {
    SEARCH_ITEMS: apiUrl + 'items/search/query',
    GET_ALL_ITEMS: apiUrl + 'items/all',
    GET_ITEMS_BY_TAG: apiUrl + 'items/get/tagName',
    GET_ITEM_BY_ID: apiUrl + 'items/get/id',
    GET_ITEMS_BY_COLLECTION_ID: apiUrl + 'items/get/collectionId',
    GET_RECENT_ITEMS: apiUrl + 'items/recent',
    ADD_ITEM: apiUrl + 'items/add',
    UPDATE_ITEM: apiUrl + 'items/update/id/item',
    DELETE_ITEM: apiUrl + 'items/delete/id'
  }
};
