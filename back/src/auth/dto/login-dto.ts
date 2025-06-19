import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: '아이디를 입력해주세요.' })
  @IsString({ message: '아이디는 문자열이어야 합니다.' })
  userId: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  password: string;
}
