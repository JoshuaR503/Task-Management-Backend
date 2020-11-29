import { IsNotEmpty } from "class-validator";

export default class CreateTaksDTO {
    @IsNotEmpty()
    title: string;
    
    @IsNotEmpty()
    description: string;
}

