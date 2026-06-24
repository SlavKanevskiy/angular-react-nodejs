import { IsInt, Max, Min } from 'class-validator';

export class GenerateLocationsDto {
  @IsInt()
  @Min(1)
  @Max(10000)
  n: number;
}
