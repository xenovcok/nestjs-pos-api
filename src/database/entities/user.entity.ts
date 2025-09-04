import { 
    BeforeInsert,
    Entity, 
    PrimaryGeneratedColumn, 
    Column,  
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";
import * as bcrypt from 'bcrypt';

export type UserRole = 'admin' | 'kasir' | 'owner';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 120 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'varchar', length: 20, default: 'kasir' })
    role: UserRole;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
        async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }
}