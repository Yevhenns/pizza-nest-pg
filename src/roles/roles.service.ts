import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private readonly logger = new Logger(RolesService.name);

  async findAll(): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.find();
      return roles;
    } catch (error) {
      this.logger.error('Error fetching roles', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
      });
      if (!role) {
        this.logger.warn(`Role with id ${id} not found`);
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      return role;
    } catch (error) {
      this.logger.error(`Error fetching role with id ${id}`, error);
      throw error;
    }
  }
}
