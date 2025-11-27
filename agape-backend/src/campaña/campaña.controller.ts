import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CampañaService } from './campaña.service';
import { CreateCampañaDto } from './dto/create-campaña.dto';
import { UpdateCampañaDto } from './dto/update-campaña.dto';
import { UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'

@Controller('campanias')
export class CampañaController {
  constructor(private readonly campañaService: CampañaService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createDto: CreateCampañaDto, @Request() req) {
    const userId = req.user?.sub ?? req.user?.id_Usuario;
    return this.campañaService.create(createDto, userId);
  }

  @Get()
  findAll() {
    return this.campañaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campañaService.findOne(+id);
  }

  @Get('owner/:id')
  findOneByOwner(@Param('id') id: number) {
    return this.campañaService.findOneByOwner(+id);
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
