import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplement } from '../entities/supplement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupplementsService {
  constructor(
    @InjectRepository(Supplement)
    private readonly supplementRepository: Repository<Supplement>,
  ) {}

  private readonly logger = new Logger(SupplementsService.name);

  async findAll() {
    try {
      const supplements = await this.supplementRepository.find({
        relations: ['category'],
      });
      return supplements;
    } catch (error) {
      this.logger.error('Error fetching supplements', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const supplement = await this.supplementRepository.findOne({
        where: { id },
        relations: ['category'],
      });
      if (!supplement) {
        this.logger.warn(`Supplement with id ${id} not found`);
        throw new NotFoundException(`Supplement with id ${id} not found`);
      }
      return supplement;
    } catch (error) {
      this.logger.error(`Error fetching supplement with id ${id}`, error);
      throw error;
    }
  }
}
