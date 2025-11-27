import { Test, TestingModule } from '@nestjs/testing';
import { CampañaService } from './campaña.service';

describe('CampañaService', () => {
  let service: CampañaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CampañaService],
    }).compile();

    service = module.get<CampañaService>(CampañaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
