import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: any,
  ): Promise<Company> {
    const newCompany = this.companiesRepository.create({
      ...createCompanyDto,
      owner: user.id,
    });
    return this.companiesRepository.save(newCompany);
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    return this.companiesRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateCompanyDto: Partial<CreateCompanyDto>,
    user: any,
  ): Promise<Company> {
    const company = await this.findOne(id);
    return this.companiesRepository.save({ ...company, ...updateCompanyDto });
  }

  async remove(id: number, user: any): Promise<void> {
    await this.companiesRepository.delete(id);
  }
}
