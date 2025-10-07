import { Controller, Get, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('test')
export class TestController {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  @Get('jwt')
  testJwt() {
    console.log('🧪 Test endpoint called');
    
    try {
      const payload = { sub: 'test-user', email: 'test@example.com' };
      const token = this.jwtService.sign(payload);
      
      console.log('✅ Test token created:', token);
      
      return {
        success: true,
        token: token,
        decoded: this.jwtService.verify(token),
      };
    } catch (error: any) {
      console.error('❌ Test endpoint failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}