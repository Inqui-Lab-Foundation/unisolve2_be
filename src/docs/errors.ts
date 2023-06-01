export const notAcceptableError = {
    description: 'Not Acceptable',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    status: {
                        type: 'number',
                        example: '406'
                    },
                    status_typeL: {
                        type: 'string',
                        example: 'error'
                    },
                    message: {
                        type: 'string',
                        example: 'Not acceptable'
                    },
                    count: {
                        type: 'number',
                        example: 1
                    },
                    data: {
                        type: 'string',
                        example: 'Something went wrong'
                    }
                }
            }
        }
    }
}

export const badRequestError = {
    description: 'Bad Request',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    status: {
                        type: 'number',
                        example: '404'
                    },
                    status_typeL: {
                        type: 'string',
                        example: 'error'
                    },
                    message: {
                        type: 'string',
                        example: 'bad request'
                    },
                    count: {
                        type: 'number',
                        example: 1
                    },
                    errors: {
                        type: 'string',
                        example: 'field missing'
                    }
                }
            }
        }
    }
}

export const notFoundError = {
    description: 'Not found',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    status: {
                        type: 'number',
                        example: '404'
                    },
                    status_typeL: {
                        type: 'string',
                        example: 'error'
                    },
                    message: {
                        type: 'string',
                        example: 'Unauthorized Access! Kindly provide a valid token'
                    },
                    count: {
                        type: 'number',
                        example: 1
                    },
                    data: {
                        type: 'array',
                        example: [{
                            "status": "",
                            "status_type": "",
                            "message": ""
                        }]
                    }
                }
            }
        }
    }
}

export const unauthorizedError = {
    description: 'unauthorized Request',
    content: {
        'application/json': {
            schema: {
                type: "object",
                properties: {
                    status: {
                        type: 'number',
                        example: '401'
                    },
                    status_typeL: {
                        type: 'string',
                        example: 'error'
                    },
                    message: {
                        type: 'string',
                        example: 'Unauthorized Access! Kindly provide a valid token'
                    },
                    count: {
                        type: 'number',
                        example: 1
                    },
                    data: {
                        type: 'array',
                        example: [{
                            "status": "",
                            "status_type": "",
                            "message": ""
                        }]
                    }
                }
            }
        }
    }
}