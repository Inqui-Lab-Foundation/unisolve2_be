import { badRequestError, notAcceptableError, unauthorizedError } from "./errors";

export const crudRequestBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'user@gmail.com',
        },
        password: {
            type: 'string',
            example: '123456789876543',
        },
        mobile: {
            type: 'string',
            example: '1234567890'
        },
        qualification: {
            type: 'string',
            example: 'mca'
        },
        created_by: {
            type: 'number',
            example: '234554335'
        }
    }
};
export const crudRequestBodyWithFile = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'user@gmail.com',
        },
        password: {
            type: 'string',
            example: '123456789876543',
        },
        mobile: {
            type: 'string',
            example: '1234567890'
        },
        qualification: {
            type: 'string',
            example: 'mca'
        },
        created_by: {
            type: 'number',
            example: '234554335'
        },
        image: {
            type: 'file'
        },
    }
};
export const crudUpdatesRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        }
    },
};
export const crudUpdatesRequestBodyWithFile = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'Completed',
        },
        image: {
            type: 'file'
        },
    },
};

export const createCrud = {
    tags: ['Crud'],
    description: 'Endpoint for crud service => creating a new record in specific table name mentioned in the req.params',
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
                default: 'user'
            },
            required: true,
            description: "Add model_name i.e table name here",
        }
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/crudRequestBody'
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
export const createCrudWithFile = {
    tags: ['Crud'],
    description: 'Endpoint for crud service => creating a new record in specific table name mentioned in the req.params with file upload service',
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
                default: 'user'
            },
            required: true,
            description: "Add model_name i.e table name here",
        }
    ],
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    $ref: '#/components/schemas/crudRequestBodyWithFile'
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

export const crudList = {
    tags: ['Crud'],
    description: 'Endpoint for crud service => get the data from the specific table name mentioned in the req.params',
    parameters: [
        {
            in: 'path',
            name: 'model_name',
            schema: {
                type: 'string',
                default: 'user'
            },
            required: true,
            description: "Add model_name i.e table name here",
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
export const crudSingle = {
    tags: ['Crud'],
    description: 'Endpoint for crud service => getting data with id specific from table name mentioned in the req.params',
    parameters: [
        {
            in: 'path',
            name: 'model_name',
            schema: {
                type: 'string',
                default: 'user'
            },
            required: true,
            description: "Add model_name i.e table name here",
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
export const crudUpdate = {
    tags: ['Crud'],
    description: 'Endpoint for crud service => updating data with id specific from table name mentioned in the req.params',
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
                default: 'user'
            },
            required: true,
            description: "Add model_name i.e table name here",
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
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/courseUpdatesRequestBody'
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
export const crudUpdateWithFile = {
    tags: ['Crud'],
    description: 'Endpoint for crud service => updating data with id specific from table name mentioned in the req.params with file upload service',
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
                default: 'user'
            },
            required: true,
            description: "Add model_name i.e table name here",
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
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    $ref: '#/components/schemas/crudUpdatesRequestBodyWithFile'
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
export const crudDelete = {
    tags: ['Crud'],
    description: 'Endpoint for crud service => remove data with id specific from table name mentioned in the req.params',
    operationId: 'courseByIdDelete',
    parameters: [
        {
            in: 'path',
            name: 'model_name',
            schema: {
                type: 'string',
                default: 'user'
            },
            required: true,
            description: "Add model_name i.e table name here",
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