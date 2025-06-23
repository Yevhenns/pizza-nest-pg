import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../roles/interfaces/role.interface';

export default class RoleSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(Role);

    for (const roleName of Object.values(UserRole)) {
      const exists = await roleRepo.findOne({ where: { name: roleName } });
      if (!exists) {
        const role = roleRepo.create({ name: roleName });
        await roleRepo.save(role);
      }
    }
  }
}
