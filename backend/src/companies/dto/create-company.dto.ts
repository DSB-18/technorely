import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  service: string;

  @IsNumber()
  capital: number;
}
