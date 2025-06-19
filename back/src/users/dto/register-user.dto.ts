import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: '아이디는 영문자와 숫자만 사용할 수 있습니다.',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: '비밀번호는 영문자와 숫자를 포함해야 합니다.',
  })
  password: string;

  @IsNotEmpty()
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;
}
