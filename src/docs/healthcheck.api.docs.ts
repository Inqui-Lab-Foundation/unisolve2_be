
export const home = {
    tags: ['Home'],
    description: 'home route',
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            'status': {
                                type: 'number',
                                example: '200'
                            },
                            'status_type': {
                                type: 'string',
                                example: 'success'
                            },
                            'apis': {
                                type: 'object',
                                example: {
                                    'docks': 'http://localhost:3002/docs',
                                    'apis': 'http://localhost:3002/api/v1',
                                    'healthcheck': 'http://localhost:3002/healthcheck'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
};
export const healthCheck = {
    tags: ['Home'],
    description: 'Endpoint to checks the server status,running time and database connectivity',
    responses: {
        '200': {
            description: 'success',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        example: {
                            "uptime": 13.9573812,
                            "message": "OK",
                            "DatabaseStatus": "Active",
                            "timestamp": 1652956210898
                        }
                    }
                }
            }
        },
    }
};