import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplementDto } from '../dto/create-supplement.dto';
import { UpdateSupplementDto } from '../dto/update-supplement.dto';
import { Supplement } from '../../../catalog/supplements/entities/supplement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SupplementsService {
  constructor(
    @InjectRepository(Supplement)
    private readonly supplementRepository: Repository<Supplement>,
  ) {}

  private readonly logger = new Logger(SupplementsService.name);

  async create(createSupplementDto: CreateSupplementDto) {
    try {
      const newSupplement =
        this.supplementRepository.create(createSupplementDto);
      const createdSupplement =
        await this.supplementRepository.save(newSupplement);

      return createdSupplement;
    } catch (error) {
      this.logger.error('Create supplement error', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Create supplement failed');
    }
  }

  async update(id: number, updateSupplementDto: UpdateSupplementDto) {
    try {
      const supplement = await this.supplementRepository.findOneBy({ id });

      if (!supplement) {
        this.logger.warn(`Supplement with id ${id} not found`);
        throw new NotFoundException('Supplement not found');
      }

      const updated = this.supplementRepository.merge(
        supplement,
        updateSupplementDto,
      );

      return await this.supplementRepository.save(updated);
    } catch (error) {
      this.logger.error('Error during update supplement', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Update supplement failed');
    }
  }

  async remove(id: number) {
    try {
      const supplement = await this.supplementRepository.findOneBy({ id });

      if (!supplement) {
        this.logger.warn(`Supplement with id ${id} not found`);
        throw new NotFoundException('Supplement not found');
      }

      await this.supplementRepository.remove(supplement);

      return { message: `Supplement with ID #${id} removed` };
    } catch (error) {
      this.logger.error('Error during delete supplement', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Delete supplement failed');
    }
  }
}
