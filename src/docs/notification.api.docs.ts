import { badRequestError, unauthorizedError } from "./errors";

export const notificationsRequestBody = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            example: 'My notification',
        },
        message: {
            type: 'string',
            example: 'This is a swagger notification',
        },
        target_audience: {
            type: 'string',
            example: 'ALL',
        },
        notification_type: {
            type: 'string',
            example: 'PUSH',
        },
        status: {
            type: 'string',
            example: 'PUBLISHED',
        }
    }
};

export const notificationsWithPosterRequestBody = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            example: 'My notification',
        },
        message: {
            type: 'string',
            example: 'This is a swagger notification',
        },
        target_audience: {
            type: 'string',
            example: 'ALL',
        },
        notification_type: {
            type: 'string',
            example: 'PUSH',
        },
        status: {
            type: 'string',
            example: 'PUBLISHED',
        }, 
        image: {
            type: 'file'
        }
    }
};

export const notificationsTome = {
    tags: ['Notifications'],
    description: 'Endpoints for getting the list of the notifications',
    security: [
        {
            bearerAuth: []
        }
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
};

export const notification = {
    tags: ['Notifications'],
    description: 'Endpoint for creating new notification',
    security: [
        {
            bearerAuth: []
        },
    ],
    requestBody: {
        required: true,
        content: {
            'application/json': {
                $ref: '#/components/schemas/notificationRequestBody'
            },
        },
    },
    responses: {
        '200': {
            description: 'new notification created successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
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
};

export const notificationWithPoster = {
    tags: ['Notifications'],
    description: 'Endpoint for creating new notification',
    security: [
        {
            bearerAuth: []
        },
    ],
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                $ref: '#/components/schemas/notificationsWithPosterRequestBody'
            },
        },
    },
    responses: {
        '200': {
            description: 'new notification created successfully',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
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
};