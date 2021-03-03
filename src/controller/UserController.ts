import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repository/UserRepository";

class UserController {
    async create(request: Request, response: Response){
        const { name, email} = request.body;
        
        const userRepository = getCustomRepository(UserRepository);

        const userAlredyExist = await userRepository.findOne({ email})

        if (userAlredyExist) {
            return response.status(400).json({
                message: "User alredy exist!"
            });
        }

        const user = userRepository.create({name, email});
        await userRepository.save(user); // await é necessário pois é uma promisse

        return response.status(201).json(user);
    }
}

export { UserController };
