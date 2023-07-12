import { badRequestError, unauthorizedError } from "./errors";

export const createTeamRequestBody = {
    type: 'object',
    properties: {
        mentor_id: {
            type: 'string',
            example: '12',
        },
        team_name: {
            type: 'string',
            example: 'fast_five',
        }
    }
};
export const teamUpdatesRequestBody = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'COMPLETED',
        }
    },
};
export const createTeam = {
    tags: ['Teams'],
    description: 'Endpoint for creating new Team category',
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
                    $ref: '#/components/schemas/createTeamRequestBody'
                },
            },
        },
    },
    responses: {
        '200': {
            description: 'New Entry added successfully',
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
}
export const teamsList = {
    tags: ['Teams'],
    description: 'Endpoint for getting list of videos created',
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
export const teamsById = {
    tags: ['Teams'],
    description: 'Endpoint for getting single Team',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'teams_id',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add teams_id to fetch specify videos ",
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
}
export const teamsByIdUpdate = {
    tags: ['Teams'],
    description: 'Endpoint for updating the specific team',
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
                    $ref: '#/components/schemas/videosUpdatesRequestBody'
                },
            },
        },
    },
    parameters: [
        {
            in: 'path',
            name: 'teams_id',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add teams_id to update specify videos",
        }
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
        '404': badRequestError,
    }
}
export const teamByIdDelete = {
    tags: ['Teams'],
    description: 'Endpoint for removing a single Team category',
    security: [
        {
            bearerAuth: [],
        },
    ],
    parameters: [
        {
            in: 'path',
            name: 'Team_id',
            schema: {
                type: 'integer',
                default: 1
            },
            required: true,
            description: "Add videos_id to delete single team details"
        }
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