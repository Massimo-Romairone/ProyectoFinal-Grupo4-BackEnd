import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonacionService } from './donacion.service';
import { CreateDonacionDto } from './dto/create-donacion.dto';
import { UpdateDonacionDto } from './dto/update-donacion.dto';

@Controller('donacion')
export class DonacionController {
  constructor(private readonly donacionService: DonacionService) {}

  @Post()
  create(@Body() createDonacionDto: CreateDonacionDto) {
    return this.donacionService.create(createDonacionDto);
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
