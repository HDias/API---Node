import request from "supertest";
import { app } from "../app";
import createConnection from "../database";

describe("Surveys", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    it("Should be able to create a new survey", async () => {
        const response = await request(app).post("/surveys").send({
            title: 'New Title',
            description: 'New DEscription'
        })

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys", async () => {
        await request(app).post("/surveys").send({
            title: 'New Title 2',
            description: 'New DEscription 2'
        })

        const response = await request(app).get("/surveys")

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    })
});