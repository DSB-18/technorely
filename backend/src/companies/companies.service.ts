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

  async create(companyData: CreateCompanyDto): Promise<Company> {
    const company = this.companiesRepository.create(companyData);
    return this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find();
  }

  async findOne(id: number): Promise<Company> {
    return this.companiesRepository.findOneBy({ id });
  }

  async update(
    id: number,
    companyData: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    await this.companiesRepository.update(id, companyData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.companiesRepository.delete(id);
  }
}
