import { badRequestError, notAcceptableError, notFoundError, unauthorizedError } from "./errors";

export const registrationRequestBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'admin@inqui-lab.org',
            describe: 'mandatory field'
        },
        password: {
            type: 'string',
            example: '12345678910',
            describe: 'mandatory field'
        },
        mobile: {
            type: 'string',
            example: '8654793625',
            describe: 'mandatory field'
        },
        qualification: {
            type: 'string',
            example: 'inqui-labs foundation',
            describe: 'mandatory field'
        },
        created_by: {
            type: 'number',
            example: '1233423989',
            describe: 'mandatory field'
        },
    },
};
export const loginRequestBody = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            example: 'admin@inqui-lab.org',
        },
        password: {
            type: 'string',
            example: '12345678910',
        }
    },
};
export const dynamicSignupFormRequestBody = {
    type: 'object',
    properties: {
        studentName: {
            type: 'boolean',
            example: 'true',
        },
        email: {
            type: 'boolean',
            example: 'true',
        },
        phNumber: {
            type: 'boolean',
            example: 'false',
        }
    },
};
export const changePasswordRequestBody = {
    type: 'object',
    properties: {
        user_id: {
            type: 'string',
            example: '2',
        },
        oldPassword: {
            type: 'string',
            example: '33a4da31c6569c14921f7b068a94b18e',
        },
        newPassword: {
            type: 'string',
            example: '17d3f297d157cfa29bd7fa04023bc56f',
        }
    },
};
export const dynamicSignupFormResponseBody = {
    type: 'object',
    properties: {
        message: {
            type: 'object',
            example: {
                'studentName': {
                    type: 'text',
                    name: 'studentName',
                    required: true,
                    selected: true,
                    value: 'name'
                },
                'email': {
                    type: 'text',
                    name: 'email',
                    required: true,
                    selected: true,
                    value: 'name'
                },
                'phNumber': {
                    type: 'number',
                    name: 'phNumber',
                    required: false,
                    selected: true,
                    value: 'number'
                }
            }
        }
    }
}

export const registration = {
    tags: ['Authentication'],
    description: 'Endpoint for registering the new member, user role default create a ADMIN, please use the role filed for the create different levels of user, list: ( ADMIN, STUDENT, MENTOR, EVALUATOR )',
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/registrationRequestBody'
                },
            },
        },
    },
    responses: {
        '201': {
            description: 'Success',
            content: {
                'application/ json': {
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
                                example: 'User registered successfully'
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
        '400': badRequestError,
        '406': notAcceptableError
    }
}
export const login = {
    tags: ['Authentication'],
    description: 'Endpoint for member login and issues the token',
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/loginRequestBody'
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
                                example: 'login successfully'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: [{ 'token': '', 'type': 'Bearer', 'expire': '3d' }]
                            }
                        }
                    }
                }
            }
        },
        '401': unauthorizedError,
        '400': badRequestError
    },

}
export const changePassword = {
    tags: ['Authentication'],
    description: 'Endpoint for member change password',
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/changePasswordRequestBody'
                },
            },
        },
    },
    responses: {
        '202': {
            description: 'success',
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
                                example: 'successfully'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: [1
                                ]
                            }
                        }
                    }
                }
            }
        },
        '400': badRequestError,
        '401': unauthorizedError,
        '404': notFoundError
    },

}
export const logout = {
    tags: ['Authentication'],
    description: 'Endpoint for clearing the member session',
    security: [
        {
            bearerAuth: [],
        },
    ],
    responses: {
        '202': {
            description: 'Accepted',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                example: 'cleared session successfully'
                            }
                        }
                    }
                }
            },
        },
        '401': unauthorizedError
    }
}
export const create_dynamicSignupForm = {
    tags: ['Authentication'],
    description: 'Endpoint for creating a json file in the server with the requested flieds',
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
                    $ref: '#/components/schemas/dynamicSignupFormRequestBody'
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
                                example: 'Successfully created'
                            },
                            count: {
                                type: 'number',
                                example: 1
                            },
                            data: {
                                type: 'array',
                                example: [
                                    'object'
                                ]
                            }
                        }
                    }
                }
            },
        },
        '401': unauthorizedError,
        '406': notAcceptableError
    }
}
export const get_dynamicSignupForm = {
    tags: ['Authentication'],
    description: 'Endpoint for getting json file created from the server',
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
        '401': unauthorizedError
    }
}
// export const changePassword = {
//     tags: ['Authentication'],
//     description: 'Endpoint for updating the admin member password field',
//     security: [
//         {
//             bearerAuth: [],
//         },
//     ],
//     requestBody: {
//         required: true,
//         content: {
//             'application/json': {
//                 schema: {
//                     $ref: '#/components/schemas/adminChangePasswordRequestBody'
//                 },
//             },
//         },
//     },
//     responses: {
//         '202': {
//             description: 'Accepted',
//             content: {
//                 'application/json': {
//                     schema: {
//                         type: 'object',
//                         properties: {
//                             status: {
//                                 type: 'string',
//                                 example: '202'
//                             },
//                             status_type: {
//                                 type: 'string',
//                                 example: 'success'
//                             },
//                             message: {
//                                 type: 'string',
//                                 example: 'User password Updated'
//                             },
//                             count: {
//                                 type: 'string',
//                                 example: 'null'
//                             },
//                             data: {
//                                 type: 'array',
//                                 example: [1]
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         '401': unauthorizedError,
//         '404': notAcceptableError
//     }
// }


// export const adminChangePassword = {
//     tags: ['Admin'],
//     description: 'Endpoint for updating the admin member password field',
//     operationId: 'changePassword',
//     security: [
//         {
//             bearerAuth: [],
//         },
//     ],
//     requestBody: {
//         required: true,
//         content: {
//             'application/json': {
//                 schema: {
//                     $ref: '#/components/schemas/adminChangePasswordRequestBody'
//                 },
//             },
//         },
//     },
//     responses: {
//         '202': {
//             description: 'Accepted',
//             content: {
//                 'application/json': {
//                     schema: {
//                         type: 'object',
//                         properties: {
//                             message: {
//                                 type: 'string',
//                                 example: 'Password updated successfully'
//                             }
//                         }
//                     }
//                 }
//             }
//         },
//         '401': unauthorizedError,
//         '503': serverError
//     }
// }
