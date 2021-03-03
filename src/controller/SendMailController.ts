import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveyRepository } from "../repository/SurveyRepository";
import { SurveyUserRepository } from "../repository/SurveyUserRepository";
import { UserRepository } from "../repository/UserRepository";
import SendMailService from "../service/SendMailService";
import { resolve } from "path";

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body

        const userRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveyUserRepository = getCustomRepository(SurveyUserRepository);
        
        const user = await userRepository.findOne({email});
        if (!user) {
            return response.status(400).json({
                message: "User does not exist!"
            });            
        }
        
        const survey = await surveyRepository.findOne({id: survey_id});
        if (!survey) {
            return response.status(400).json({
                message: "Survey does not exist!"
            });            
        }
        
        const mpsPath = resolve(__dirname, "..", "views", "email", "nps-mail.hbs");
        
        const messageMail = {
            from: 'NPS <norepaly@gmail.com>',
            to: email,
            subject: survey.title,
            text: survey.description
        }

        let surveyUser = await surveyUserRepository.findOne({
            where:{user_id: user.id, value: null},
            relations: ["user", "survey"]
        })

        const variabledTemplate = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            survey_user_id: "",
            link: process.env.URL_MAIL
        }
        
        if(surveyUser) {
            variabledTemplate.survey_user_id = surveyUser.id;
            await SendMailService.execute(messageMail, variabledTemplate, mpsPath)
            return response.json(surveyUser);
        }

        surveyUser = surveyUserRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveyUserRepository.save(surveyUser);

        variabledTemplate.survey_user_id = surveyUser.id;
        await SendMailService.execute(messageMail, variabledTemplate, mpsPath)
        return response.status(201).json(surveyUser);
    }

}

export { SendMailController };
