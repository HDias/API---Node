import { EntityRepository, Repository } from "typeorm";
import { Survey } from "../entity/Survey";

@EntityRepository(Survey)
class SurveyRepository extends Repository<Survey> {

}

export { SurveyRepository };
