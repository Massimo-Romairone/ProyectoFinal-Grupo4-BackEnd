import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CampañaService } from './campaña.service';
import { CreateCampañaDto } from './dto/create-campaña.dto';
import { UpdateCampañaDto } from './dto/update-campaña.dto';

@Controller('campaña')
export class CampañaController {
  constructor(private readonly campañaService: CampañaService) {}

  @Post()
  create(@Body() createCampañaDto: CreateCampañaDto) {
    return this.campañaService.create(createCampañaDto);
  }

  @Get()
  findAll() {
    return this.campañaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campañaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampañaDto: UpdateCampañaDto) {
    return this.campañaService.update(+id, updateCampañaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campañaService.remove(+id);
  }
}
