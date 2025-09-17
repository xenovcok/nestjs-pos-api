import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('inventories')
export class Inventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    product_id: number;

    @Column()
    change: number;

    @Column()
    type: 'in' | 'out';

    @CreateDateColumn()
    created_at: Date;
}