import { healthCheck, home } from "./healthcheck.api.docs";
import { version } from '../../package.json';
import {
    courseList,
    createCourse,
    courseById,
    courseByIdUpdate,
    courseByIdDelete,
    createCourseRequestBody,
    courseUpdatesRequestBody
} from "./course.api.docs";
import {
    courseTopicList,
    createCourseTopic,
    courseTopicById,
    courseTopicByIdUpdate,
    courseTopicByIdDelete,
    courseTopicProgress,
    courseTopicProgressRequestBody,
    createCourseTopicRequestBody,
    courseTopicUpdatesRequestBody
} from "./courseTopic.api.docs";
import {
    moduleList,
    createModule,
    moduleById,
    moduleByIdUpdate,
    moduleByIdDelete,
    createModuleRequestBody,
    moduleUpdatesRequestBody
} from "./module.api.docs";
import {
    videosList,
    createVideos,
    videosById,
    videosByIdUpdate,
    videosByIdDelete,
    createVideosRequestBody,
    videosUpdatesRequestBody,
} from "./video.api.docs";
import {
    create_dynamicSignupForm,
    get_dynamicSignupForm,
    login,
    logout,
    registration,
    registrationRequestBody,
    changePassword,
    changePasswordRequestBody,
    loginRequestBody,
    dynamicSignupFormRequestBody
} from "./auth.api.docs";
import {
    createCrud, createCrudWithFile, crudDelete, crudList, crudUpdate, crudUpdateWithFile, crudRequestBodyWithFile, crudRequestBody,
    crudUpdatesRequestBodyWithFile,
    crudSingle,
} from "./crud.api.docs";
import { createTeam, teamByIdDelete, teamsById, teamsByIdUpdate, teamsList, createTeamRequestBody, teamUpdatesRequestBody } from "./team.api.docs";
import { notificationsTome, notificationWithPoster, notification, notificationsWithPosterRequestBody, notificationsRequestBody } from "./notification.api.docs";
import {
    createWorksheetRequestBody,
    worksheetUpdatesRequestBody, createWorksheet, worksheetById, worksheetByIdUpdate, worksheetList, WorksheetsByIdDelete
} from "./worksheets.api.docs";
import { organizationList, createOrganization, organizationSingle, organizationDelete, organizationUpdate, createOrganizationWithFile, organizationRequestBody, organizationRequestBodyWithFile, organizationUpdatesRequestBody } from "./organization.api.docs";

// define Swagger options with specific properties
const options = {
    openapi: '3.0.1',
    info: {
        title: "Unislove API Docs",
        description: "Unislove backend applications api documentation with in details API description",
        version,
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    server: [
        {
            url: 'http://localhost:3002',
            description: 'development Server',
        },
    ],
    schemes: ['https', 'http'],
    tags: [
        {
            name: 'Home',
        },
        {
            name: 'Authentication',
        },
        {
            name: 'Crud',
        },
        {
            name: 'Courses',
        },
        {
            name: 'Course Modules',
        },
        {
            name: 'Course Topics',
        },
        {
            name: 'Worksheets',
        },
        {
            name: 'Videos',
        },
        {
            name: 'Teams',
        },
        {
            name: 'Notifications',
        },
        {
            name: 'Organization',
        },
    ],
    paths: {
        '/': {
            get: home
        },
        '/healthCheck': {
            get: healthCheck,
        },
        //auth
        '/api/v1/auth/register': {
            post: registration
        },
        '/api/v1/auth/changePassword': {
            put: changePassword
        },
        '/api/v1/auth/login': {
            post: login
        },
        '/api/v1/auth/logout': {
            get: logout
        },
        '/api/v1/auth/dynamicSignupForm': {
            post: create_dynamicSignupForm,
            get: get_dynamicSignupForm
        },
        //crud
        '/api/v1/crud/{model_name}': {
            post: createCrud,
            get: crudList
        },
        '/api/v1/crud/{model_name}/{id}': {
            get: crudSingle,
            put: crudUpdate,
            delete: crudDelete
        },
        '/api/v1/crud/{model_name}/withfile': {
            post: createCrudWithFile,
            put: crudUpdateWithFile
        },
        //course
        '/api/v1/courses': {
            post: createCourse,
            get: courseList
        },
        '/api/v1/courses/{course_id}': {
            get: courseById,
            put: courseByIdUpdate,
            delete: courseByIdDelete
        },
        //course modules
        '/api/v1/courseModules': {
            post: createModule,
            get: moduleList
        },
        '/api/v1/courseModules/{module_id}': {
            get: moduleById,
            put: moduleByIdUpdate,
            delete: moduleByIdDelete
        },
        //videos
        '/api/v1/videos/': {
            post: createVideos,
            get: videosList
        },
        '/api/v1/videos/{video_id}': {
            get: videosById,
            put: videosByIdUpdate,
            delete: videosByIdDelete
        },
        //courseTopics
        '/api/v1/courseTopics': {
            post: createCourseTopic,
            get: courseTopicList
        },
        '/api/v1/courseTopics/{topic_id}': {
            get: courseTopicById,
            put: courseTopicByIdUpdate,
            delete: courseTopicByIdDelete
        },
        '/api/v1/userTopicProgress': {
            post: courseTopicProgress
        },
        //worksheets
        '/api/v1/worksheets': {
            post: createWorksheet,
            get: worksheetList
        },
        '/api/v1/worksheet/{worksheet_id}': {
            get: worksheetById,
            put: worksheetByIdUpdate,
            delete: WorksheetsByIdDelete
        },
        //teams
        '/api/v1/teams/': {
            post: createTeam,
            get: teamsList
        },
        '/api/v1/teams/{team_id}': {
            get: teamsById,
            put: teamsByIdUpdate,
            delete: teamByIdDelete
        },
        //Notifications
        '/api/v1/notifications/tome': {
            get: notificationsTome
        },
        '/api/v1/notifications/send': {
            post: notification
        },
        '/api/v1/notifications/sendwithposter': {
            post: notificationWithPoster
        },
        //organization
        '/api/v1/organization/': {
            post: createOrganization,
            get: organizationList
        },
        '/api/v1/organization/{organization_id}': {
            put: organizationUpdate,
            delete: organizationDelete
        },
        '/api/v1/organization/withFile': {
            post: createOrganizationWithFile
        }
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            registrationRequestBody,
            loginRequestBody,
            changePasswordRequestBody,
            dynamicSignupFormRequestBody,
            crudRequestBody,
            crudRequestBodyWithFile,
            crudUpdatesRequestBodyWithFile,
            createCourseRequestBody,
            courseUpdatesRequestBody,
            createCourseTopicRequestBody,
            courseTopicUpdatesRequestBody,
            courseTopicProgressRequestBody,
            createModuleRequestBody,
            moduleUpdatesRequestBody,
            createWorksheetRequestBody,
            worksheetUpdatesRequestBody,
            createVideosRequestBody,
            videosUpdatesRequestBody,
            createTeamRequestBody,
            teamUpdatesRequestBody,
            notificationsWithPosterRequestBody,
            notificationsRequestBody,
            organizationRequestBody,
            organizationRequestBodyWithFile,
            organizationUpdatesRequestBody
        },
    },
};

export { options };
