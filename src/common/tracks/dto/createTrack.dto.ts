import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  artistId: string | null;

  @IsUUID()
  @ValidateIf((object, value) => value !== null)
  albumId: string | null;

  @IsInt()
  @IsNotEmpty()
  duration: number;
}
