import { badRequestError, notAcceptableError, unauthorizedError } from "./errors";

export const organizationRequestBody = {
    type: 'object',
    properties: {
        organization_name: {
            type: 'string',
            example: 'Comcast',
        },
        organization_code: {
            type: 'string',
            example: '8034r91446',
        },
        details: {
            type: 'string',
            example: '1234567890'
        },
        created_by: {
            type: 'number',
            example: '234554335'
        }
    }
};
export const organizationRequestBodyWithFile = {
    type: 'object',
    properties: {
        image: {
            data: 'file'
        },
    }
};
export const organizationUpdatesRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        }
    },
};

export const createOrganization = {
    tags: ['Organization'],
    description: 'Endpoint for organizations service => creating a new record in specific table name mentioned in the req.params',
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/organizationRequestBody'
                },
            },
        },
    },
    responses: {
        '201': {
            description: 'Created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number',
                                example: '201'
                            },
                            status_typeL: {
                                type: 'string',
                                example: 'success'
                            },
                            message: {
                                type: 'string',
                                example: 'file found'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: ['object']
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError
    }
}
export const createOrganizationWithFile = {
    tags: ['Organization'],
    description: 'Endpoint for organization service => creating a new record in specific table name mentioned in the req.params with file upload service',
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    $ref: '#/components/schemas/organizationRequestBodyWithFile'
                },
            },
        },
    },
    responses: {
        '201': {
            description: 'Created',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number',
                                example: '201'
                            },
                            status_typeL: {
                                type: 'string',
                                example: 'success'
                            },
                            message: {
                                type: 'string',
                                example: 'file found'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: ['object']
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError,
        '406': notAcceptableError,
    }
}

export const organizationList = {
    tags: ['Organization'],
    description: 'Endpoint for crud service => get the data from the specific table name mentioned in the req.params',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'Success',
            content: {
                'applications/json': {
                    schema: {
                        properties: {
                            status: {
                                type: 'number',
                                example: '200'
                            },
                            status_typeL: {
                                type: 'string',
                                example: 'success'
                            },
                            message: {
                                type: 'string',
                                example: 'OK'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: ['object']
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError
    }
}
export const organizationSingle = {
    tags: ['Organization'],
    description: 'Endpoint for crud service => getting data with id specific from table name mentioned in the req.params',
    parameters: [
        {
            in: 'path',
            name: 'organization_id',
            schema: {
                type: 'string',
                default: 'organization'
            },
            required: true,
            description: "Add organization_id i.e table name here",
        },
        {
            in: 'path',
            name: 'id',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add id specific id in the model_name above",
        }
    ],
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'Success',
            content: {
                'applications/json': {
                    schema: {
                        properties: {
                            status: {
                                type: 'number',
                                example: '200'
                            },
                            status_typeL: {
                                type: 'string',
                                example: 'success'
                            },
                            message: {
                                type: 'string',
                                example: 'OK'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: ['object']
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError
    }
}
export const organizationUpdate = {
    tags: ['Organization'],
    description: 'Endpoint for Organization service => updating data with id specific from table name mentioned in the req.params',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'model_name',
            schema: {
                type: 'string',
                default: 'Organization'
            },
            required: true,
            description: "Add organization_name i.e table name here",
        },
        {
            in: 'path',
            name: 'organization_id',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add id specific id in the model_name above",
        }
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/organizationUpdatesRequestBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            status: {
                                type: 'number',
                                example: '200'
                            },
                            status_typeL: {
                                type: 'string',
                                example: 'success'
                            },
                            message: {
                                type: 'string',
                                example: 'OK'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: ['object']
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError
    }
}

export const organizationDelete = {
    tags: ['Organization'],
    description: 'Endpoint for organization service => remove data with id specific from table name mentioned in the req.params',
    operationId: 'courseByIdDelete',
    parameters: [
        {
            in: 'path',
            name: 'model_name',
            schema: {
                type: 'string',
                default: 'organization'
            },
            required: true,
            description: "Add model_name i.e table name here",
        },
        {
            in: 'path',
            name: 'organization_id',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add id specific id in the model_name above",
        }
    ],
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        properties: {
                            status: {
                                type: 'number',
                                example: '200'
                            },
                            status_typeL: {
                                type: 'string',
                                example: 'success'
                            },
                            message: {
                                type: 'string',
                                example: 'OK'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: ['object']
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '404': badRequestError
    }
}