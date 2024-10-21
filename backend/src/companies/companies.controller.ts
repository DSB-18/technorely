import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req,
  ): Promise<{ message: string; company: Company }> {
    const company = await this.companiesService.create(
      createCompanyDto,
      req.user,
    );
    return { message: 'Company created successfully', company };
  }

  @Get()
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCompanyDto: Partial<CreateCompanyDto>,
    @Req() req,
  ): Promise<{ message: string; company: Company }> {
    const company = await this.companiesService.update(
      id,
      updateCompanyDto,
      req.user,
    );
    return { message: 'Company updated successfully', company };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() req,
  ): Promise<{ message: string }> {
    await this.companiesService.remove(id, req.user);
    return { message: 'Company deleted successfully' };
  }
}
