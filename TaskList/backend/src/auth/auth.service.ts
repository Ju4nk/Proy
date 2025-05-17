import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
console.log('JWT_SECRET:', process.env.JWT_SECRET);
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log('Usuario encontrado:', user);
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException('Credenciales incorrectas');
  }

async login(user: any) {
  console.log('JWT_SECRET en login:', process.env.JWT_SECRET);
  console.log('Firmando JWT con payload:', { sub: user.id, email: user.email });

  const payload = { sub: user.id, email: user.email };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
  async register(username: string, email: string, password: string) {
    return this.usersService.create(username, email, password); // 👈 
  }
}