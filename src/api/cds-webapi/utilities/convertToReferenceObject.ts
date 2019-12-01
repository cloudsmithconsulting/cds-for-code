/**
 * @typedef {Object} ReferenceObject
 * @property {string} id Id of the Entity record
 * @property {string} collection Collection name that the record belongs to
 * @property {string} oDataContext OData context returned in the response
 */
export interface ReferenceObject {
    id: string;
    collection: string;
    oDataContext: string;
}

/**
 * Converts a response to a reference object
 *
 * @param {Object} responseData - Response object
 * @returns {ReferenceObject} reference object
 */
export default function convertToReferenceObject(responseData:Object): ReferenceObject {
    const result = /\/(\w+)\(([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})/i.exec(responseData["@odata.id"]);

    return { id: result[2], collection: result[1], oDataContext: responseData["@odata.context"] };
}