import { 
    BeforeInsert,
    Entity, 
    PrimaryGeneratedColumn, 
    Column,  
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";
import * as bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'admin',
    KASIR = 'kasir',
    OWNER = 'owner'
}

export enum Status {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BANNED = 'banned'
}

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

    @Column({ type: 'varchar', length: 20, default: UserRole.KASIR })
    role: UserRole;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE
    })
    status: Status;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
        async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }
}