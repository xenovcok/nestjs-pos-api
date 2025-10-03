import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('inventories')
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_id: number;

    @Column()
    change: number;

    @Column({ nullable: true })
    reference_id: string;

    @Column()
    type: 'in' | 'out';

    @Column({ nullable: true })
    note: string;

    @CreateDateColumn()
    created_at: Date;
}