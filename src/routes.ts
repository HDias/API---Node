import { Router } from "express";
import { SendMailController } from "./controller/SendMailController";
import { SurveyController } from "./controller/SurveyController";
import { UserController } from "./controller/UserController";

const router = Router();


const userController = new UserController();
router.post("/users", userController.create);

const surveyController = new SurveyController();
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.index);

const sendMailController = new SendMailController();
router.post("/sendMail", sendMailController.execute);

export { router };
