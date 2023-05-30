import "dotenv/config";
import validateEnv from '../../validate_env';
import request from 'supertest';

import App from '../../../app';
import AuthController from '../../../controllers/auth.controller';
import CRUDService from '../../../services/crud.service';

// validating env variables
validateEnv();

// express application
const app: any = new App([new AuthController], Number(process.env.APP_PORT));

const crud_service = new CRUDService();

let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaW5kRW50cnkiOnsiaWQiOiI0YmZhNDFjMi0wNGE4LTRmYWYtOWJkNC0yOTBjMjgwMzAyMzgiLCJ0ZWFtX2lkIjpudWxsLCJzdHVkZW50X25hbWUiOiJ2YW1zaGkiLCJtb2JpbGUiOjc1OTI0NTg5NjMsImVtYWlsIjoidmFtc2hpMTJAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkQ3dUeWNVWFd1ZTBUaHE5U3RqVU0wdWR2dE5ZSTRsWjUwTmZ5MUlCaVcuVzBmWmhWSVJOUmEiLCJkYXRlX29mX2JpcnRoIjoiMjUvMDUvMjAwMyIsImluc3RpdHV0ZV9uYW1lIjoic29tZXRoaW5nIGluc3RpdHV0ZSBvZiB0ZWNoIiwic3RyZWFtIjpudWxsLCJjaXR5IjoiSHlkZXJhYmFkIiwiZGlzdHJpY3QiOiJyYW5nYXJlZGR5Iiwic3RhdGUiOiJ0ZWxhbmdhbmEiLCJjb3VudHJ5IjoiaW5kaWEiLCJzdGF0dWUiOm51bGwsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjJUMDk6MDg6MTcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMjRUMTM6MTI6MjMuMDAwWiJ9LCJzZXNzaW9uIjo3NiwiaWF0IjoxNjQ4NjMzNjUyLCJleHAiOjE2ODAxOTEyNTJ9.vC0zUP3zUAsOBNp-Hg6Hl-_2hleFAJptyTnBQYRGR9u6VmtZ2OTPgJRKu84T5Eg0wYjt2d6ANFRg7aE4lVhpu4ndmpdFBrEuIDp_dClK6lsFDVrif5QGmu0afHcrR1b6YBmN-_w0C-d__rQQr9WSZZvT40kP22So0nFtUwOGXqY'

describe("API - user registration", () => {
    const payload = {
        "email": "admin23@gamil.com",
        "password": "1234567890",
        "mobile": "1244567890",
        "qualification": "b.com",
        "created_by": 898238945
    };
    // test("return 201 successfully registered", async () => {
    //     const response = await request(app.app).post('/api/v1/auth/register').send(payload);
    //     expect(response.statusCode).toBe(201);
    // });
    test("return 406 if the user not found", async () => {
        const response = await request(app.app).post('/api/v1/auth/register').send(payload);
        expect(response.statusCode).toBe(406)
    });
    test("return 400 if user send the empty payload", async () => {
        const response = await request(app.app).post('/api/v1/auth/register').send({});
        expect(response.statusCode).toBe(400)
    });
});
describe("API - user login", () => {
    const payload = {
        "email": "admin23@gamil.com",
        "password": "1234567890"
    };
    test("return 200 successfully logged in", async () => {
        const response = await request(app.app).post('/api/v1/auth/login').send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    test("return 400 if user send the empty payload", async () => {
        const response = await request(app.app).post('/api/v1/auth/login').send({});
        expect(response.statusCode).toBe(400)
    });
});
describe("API - user change password", () => {
    const payload = {
        "user_id": "16",
        "old_password": "1235678910",
        "new_password": "123567891011"
    };
    const payload2 = {
        "user_id": "11",
        "old_password": "1235678",
        "new_password": "1235678910"
    };
    test("return 202 successfully updated", async () => {
        const response = await request(app.app).put('/api/v1/auth/changePassword').send(payload);
        expect(response.statusCode).toBe(202);
        expect(response.body).toHaveProperty('data');
    });
    test("return 400 if user send the empty payload", async () => {
        const response = await request(app.app).put('/api/v1/auth/changePassword').send({});
        expect(response.statusCode).toBe(400);
    });
    test("return 404 user password missmatch", async () => {
        const response = await request(app.app).put('/api/v1/auth/changePassword').send(payload2);
        expect(response.statusCode).toBe(404)
    });
});
describe("API - user logout", () => {
    test("return 200 successfully registered", async () => {
        const response = await request(app.app).get('/api/v1/auth/logout').set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImFkbWluQGdhbWlsLmNvbSIsImZ1bGxfbmFtZSI6bnVsbCwiaW1hZ2UiOm51bGwsImRhdGVfb2ZfYmlydGgiOm51bGwsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJ0ZWFtX2lkIjpudWxsLCJvcmdfbmFtZSI6bnVsbCwicXVhbGlmaWNhdGlvbiI6ImIuY29tIiwic3RyZWFtIjpudWxsLCJjaXR5IjpudWxsLCJkaXN0cmljdCI6bnVsbCwic3RhdGUiOm51bGwsImNvdW50cnkiOm51bGwsInN0YXR1cyI6IkFDVElWRSIsInJvbGUiOiJBRE1JTiIsImlzX2xvZ2dlZGluIjoiTk8iLCJsYXN0X2xvZ2luIjpudWxsLCJjcmVhdGVkX2J5IjoxMjM2NTQ3ODk5LCJjcmVhdGVkX2F0IjoiMjAyMi0wNi0yMVQxNDo1MTowNy4wMDBaIiwidXBkYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9hdCI6IjIwMjItMDYtMjFUMTQ6NTE6MDcuMDAwWiIsImlhdCI6MTY1NTgyMzA4NCwiZXhwIjoxNjU2MDgyMjg0fQ.mIzNccNjPeWtJ3pvselchjGIbhoTkOQd9BQ8pU7Gjio`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
});
describe("API - Dynamic Signup form", () => {
    const payload = {
        "studentName": true,
        "phNumber": false
    }
    test("return 200 post creating the dynamic file in server", async () => {
        const response = await request(app.app).post('/api/v1/auth/dynamicSignupForm').set("Authorization", `Bearer ${token}`).send(payload);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    test("return 400 when sent empty payload", async () => {
        const response = await request(app.app).post('/api/v1/auth/dynamicSignupForm').set("Authorization", `Bearer ${token}`).send({});
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
    test("return 200 fetch the file from the server", async () => {
        const response = await request(app.app).get('/api/v1/auth/dynamicSignupForm').set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
});