import "dotenv/config";
import validateEnv from '../../validate_env';
import request from 'supertest';

import App from '../../../app';
import CRUDService from '../../../services/crud.service';
import CRUDController from "../../../controllers/crud.controller";

// validating env variables
validateEnv();

// express application
const app: any = new App([new CRUDController], Number(process.env.APP_PORT));

const crud_service = new CRUDService();

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJlbWFpbCI6ImFkbWluQGdhbWlsLmNvbSIsImZ1bGxfbmFtZSI6bnVsbCwiaW1hZ2UiOm51bGwsImRhdGVfb2ZfYmlydGgiOm51bGwsIm1vYmlsZSI6IjEyMzQ1Njc4OTAiLCJ0ZWFtX2lkIjpudWxsLCJvcmdfbmFtZSI6bnVsbCwicXVhbGlmaWNhdGlvbiI6ImIuY29tIiwic3RyZWFtIjpudWxsLCJjaXR5IjpudWxsLCJkaXN0cmljdCI6bnVsbCwic3RhdGUiOm51bGwsImNvdW50cnkiOm51bGwsInN0YXR1cyI6IkFDVElWRSIsInJvbGUiOiJBRE1JTiIsImlzX2xvZ2dlZGluIjoiTk8iLCJsYXN0X2xvZ2luIjpudWxsLCJjcmVhdGVkX2J5IjoxMjM2NTQ3ODk5LCJjcmVhdGVkX2F0IjoiMjAyMi0wNi0yMVQxNDo1MTowNy4wMDBaIiwidXBkYXRlZF9ieSI6bnVsbCwidXBkYXRlZF9hdCI6IjIwMjItMDYtMjFUMTQ6NTE6MDcuMDAwWiIsImlhdCI6MTY1NTgyMzA4NCwiZXhwIjoxNjU2MDgyMjg0fQ.mIzNccNjPeWtJ3pvselchjGIbhoTkOQd9BQ8pU7Gjio'

describe("API - CRUD", () => {
    const payload = {
        "email": "admin@gamil.com",
        "password": "12345678910",
        "mobile": "1234567890",
        "qualification": "b.com",
        "created_by": 1236547899
    }
    // "return 201 create entry click
    test("return 201 create entry", async () => {
        const response = await request(app.app).post('/api/v1/crud/user').set("Authorization", `Bearer ${token}`).send(payload);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('data');
    });
    test("return 200 crud list", async () => {
        const response = await request(app.app).get('/api/v1/crud/user').set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    test("return 200 single crud item", async () => {
        const response = await request(app.app).get('/api/v1/crud/user/11').set("Authorization", `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    test("return 200 update entry", async () => {
        const response = await request(app.app).put('/api/v1/crud/user/11').set("Authorization", `Bearer ${token}`).send(payload.mobile);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    test("return 200 delete entry", async () => {
        const response = await request(app.app).delete('/api/v1/crud/user/11').set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('data');
    });
    test("return 404 data not found", async () => {
        const response = await request(app.app).delete('/api/v1/crud/user/0').set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('data');
    });
});