import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { CreateOrderMailDto } from '~/order-mail/dto/create-order-mail.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { CustomJwtPayload } from '~/auth/interfaces/auth.interface';
import { ToUserDto } from '../dto/to-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { SuccessDto } from '~/dto/success.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user orders list' })
  @ApiResponse({
    status: 200,
    description: 'Returns user orders list',
    type: [CreateOrderMailDto],
  })
  findAllOrders(@CurrentUser() user: CustomJwtPayload) {
    return this.userService.findAllOrders(user);
  }

  @Get('orders/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns user order by ID',
    type: CreateOrderMailDto,
  })
  findOneOrder(@CurrentUser() user: CustomJwtPayload, @Param('id') id: string) {
    return this.userService.findOneOrder(user, +id);
  }

  @Patch()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user info' })
  @ApiResponse({
    status: 200,
    description: 'Returns updated user',
    type: ToUserDto,
  })
  update(
    @CurrentUser() user: CustomJwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user, updateUserDto);
  }

  @Patch('change_password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Returns object { success: true }',
    type: SuccessDto,
  })
  changePassword(
    @CurrentUser() user: CustomJwtPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user, changePasswordDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns object { message: "User with ID # removed" }',
    type: SuccessDto,
  })
  remove(@CurrentUser() user: CustomJwtPayload) {
    return this.userService.remove(user);
  }
}
