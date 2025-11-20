import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonacionService } from './donacion.service';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';
import { UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'

@Controller('donaciones')
export class DonacionController {
  constructor(private readonly donacionService: DonacionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createDonacionDto: CreateDonacionDto, @Request() req) {
    const userId = req.user?.sub ?? req.user?.id_Usuario;
    return this.donacionService.create(createDonacionDto, userId);
  }

  @Get('campania/:id')
  findAllByCamp(@Param('id') id: string) {
    return this.donacionService.findAllByCamp(+id);
  }

  @Get('usuario/:id')
  findAllByUser(@Param('id') id: string) {
    return this.donacionService.findAllByUser(+id);
  }

  @Get()
  findAll() {
    return this.donacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonacionDto: UpdateDonacionDto) {
    return this.donacionService.update(+id, updateDonacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donacionService.remove(+id);
  }
}
