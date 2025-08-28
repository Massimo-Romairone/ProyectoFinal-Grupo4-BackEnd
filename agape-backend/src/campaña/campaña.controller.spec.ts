import { Test, TestingModule } from '@nestjs/testing';
import { CampañaController } from './campaña.controller';
import { CampañaService } from './campaña.service';

describe('CampañaController', () => {
  let controller: CampañaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampañaController],
      providers: [CampañaService],
    }).compile();

    controller = module.get<CampañaController>(CampañaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
