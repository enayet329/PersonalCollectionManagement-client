
// local IIS apiUrl for development environment
//const apiUrl = 'https://localhost:7138/api/v1/';

// apiurl for production environment
 const apiUrl = 'https://collectionapp.somee.com/api/v1/';

// apiUrl for development environment
 //const apiUrl = 'https://localhost:7138/api/v1/';

// Collection Constants
export const CollectionConstants = {
  API_ENDPOINTS: {
    GET_COLLECTIONS: apiUrl + 'collections',
    GET_LARGEST_COLLECTIONS: apiUrl + 'collections/largest',
    ADD_COLLECTION: apiUrl + 'collections/add',
    DELETE_COLLECTION: apiUrl + 'collections/delete/id',
    GET_COLLECTION_BY_ID: apiUrl + 'collections/get/id',
    GET_COLLECTIONS_BY_USER_ID: apiUrl + 'collections/get/userId',
    UPDATE_COLLECTION: apiUrl + 'collections/update/id',
    GET_COLLECTION_CATEGORY : apiUrl + 'collections/get/categories',
  },
};

export const SearchConstants ={
  API_ENDPOINTS: {
    FULL_TEXT_SEARCH: apiUrl + 'search/full-text-search',
  },
}
// Item Constants
export const ItemConstants = {
  API_ENDPOINTS: {
    GET_ALL_ITEMS: apiUrl + 'items/all',
    GET_ITEMS_BY_TAG: apiUrl + 'items/get/tagName',
    GET_ITEM_BY_ID: apiUrl + 'items/get/id',
    GET_ITEMS_BY_COLLECTION_ID: apiUrl + 'items/get/collectionId',
    GET_RECENT_ITEMS: apiUrl + 'items/recent',
    ADD_ITEM: apiUrl + 'items/add',
    UPDATE_ITEM: apiUrl + 'items/update',
    DELETE_ITEM: apiUrl + 'items/delete/id',
  },
};

//Admin constants
export const AdminConstants = {
  API_ENDPOINTS: {
    GET_USERS: apiUrl + 'admin/users',
    CREATE_COLLECTION: apiUrl + 'admin/collections',
    CREATE_ITEM: apiUrl + 'admin/items',
    GET_USER_BY_ID: apiUrl + 'admin/user/id',
    GET_USER_BY_EMAIL: apiUrl + 'admin/user/email',
    UPGRADE_ADMIN_ROLE: apiUrl + 'admin/user/upgrade/admin',
    DOWNGRADE_ADMIN_ROLE: apiUrl + 'admin/user/downgrade/admin',
    DELETE_USER: apiUrl + 'admin/delete/user',
    BLOCK_USER: apiUrl + 'admin/user/block',
    UNBLOCK_USER: apiUrl + 'admin/users/unblock',
  },
};


// User Constants
export const UserConstants = {
  API_ENDPOINTS: {
    REGISTER: apiUrl + 'accounts/register',
    LOGIN: apiUrl + 'accounts/login',
    UPDATE_USER: apiUrl + 'accounts/update',
    REFRESH_TOKEN: apiUrl + 'accounts/refresh-token',
    GET_USER_BY_ID: apiUrl + 'accounts/user/id',
    GET_USER_BY_EMAIL: apiUrl + 'accounts/user/email',
    CHECK_USERNAME_AVAILABILITY: apiUrl + 'accounts/availability/username',
    CHECK_EMAIL_AVAILABILITY: apiUrl + 'accounts/availability/email',
    UPDATE_LANGUAGE: apiUrl + 'accounts/language/userId',
    UPDATE_THEME: apiUrl + 'accounts/theme/userId',
  },
};

// Comment Constants
export const CommentConstants = {
  API_ENDPOINTS: {
    GET_COMMENTS_BY_ITEM_ID: apiUrl + 'comments/itemId',
    GET_COMMENT_BY_ID: apiUrl + 'comments/get/id',
    ADD_COMMENT: apiUrl + 'comments',
    DELETE_COMMENT: apiUrl + 'comments/delete/commentId',
    UPDATE_COMMENT: apiUrl + 'comments/update',
  },
};

// Like Constants
export const LikeConstants = {
  API_ENDPOINTS: {
    TOGGLE_LIKE: apiUrl + 'likes/toggle',
    GET_LIKE_BY_ITEM_ID: apiUrl + 'likes/itemId',
    GET_LIKE_BY_USER_ID: apiUrl + 'likes/IsItemLiked',
  },
};


// customField Constants
export const CustomFieldConstants = {
  API_ENDPOINTS: {
    GET_CUSTOM_FIELDS_BY_COLLECTION_ID: apiUrl + 'custom-fields/collectionId',
    ADD_CUSTOM_FIELD: apiUrl + 'custom-fields/add',
    DELETE_CUSTOM_FIELD: apiUrl + 'custom-fields/delete/id',
    UPDATE_CUSTOM_FIELD: apiUrl + 'custom-fields/update',
  },
};

// customFieldValue Constants
export const CustomFieldValueConstants = {
  API_ENDPOINTS: {
    GET_CUSTOM_FIELD_VALUES_BY_ITEM_ID: apiUrl + 'custom-field-values/itemId',
    ADD_CUSTOM_FIELD_VALUE: apiUrl + 'custom-field-values/add',
    DELETE_CUSTOM_FIELD_VALUE: apiUrl + 'custom-field-values/delete/id',
    UPDATE_CUSTOM_FIELD_VALUE: apiUrl + 'custom-field-values/update',
  },
};

// Tag Constants
export const TagConstants = {
  API_ENDPOINTS: {
    GET_TAGS: apiUrl + 'tags',
    GET_TOP_TAGS: apiUrl + 'tags/top',
    GET_TAGS_BY_ITEM_ID: apiUrl + 'tags/itemId',
    GET_TAG_BY_ID: apiUrl + 'tags/id',
    ADD_TAG: apiUrl + 'tags/add',
    DELETE_TAG: apiUrl + 'tags/delete/id',
    UPDATE_TAG: apiUrl + 'tags/update',
  },
};
