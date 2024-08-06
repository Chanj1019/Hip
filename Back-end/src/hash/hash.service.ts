// import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class HashService {
//     private readonly saltRounds = 10; // 해싱에 사용할 솔트 라운드 수

//     async hashPassword(password: string): Promise<string> {
//         return bcrypt.hash(password, this.saltRounds); // 비밀번호 해싱
//     }

//     async comparePasswords(password: string, hash: string): Promise<boolean> {
//         return bcrypt.compare(password, hash); // 비밀번호 비교
//     }no
// }
// src/hash/hash.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
