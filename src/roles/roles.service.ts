import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  private readonly logger = new Logger(RolesService.name);

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      this.logger.error('Error creating role', error);
      throw error;
    }
  }

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
      const role = await this.roleRepository.findOneBy({ id });
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

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.roleRepository.findOneBy({ id });
      if (!role) {
        this.logger.warn(`Role with id ${id} not found`);
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      Object.assign(role, updateRoleDto);
      return await this.roleRepository.save(role);
    } catch (error) {
      this.logger.error(`Error updating role with id ${id}`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<{
    message: string;
  }> {
    try {
      const role = await this.roleRepository.findOneBy({ id });
      if (!role) {
        this.logger.warn(`Role with id ${id} not found`);
        throw new NotFoundException(`Role with id ${id} not found`);
      }
      await this.roleRepository.remove(role);
      return { message: `Role with id ${id} removed successfully` };
    } catch (error) {
      this.logger.error(`Error removing role with id ${id}`, error);
      throw error;
    }
  }
}
