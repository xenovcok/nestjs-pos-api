import {  Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('sales_items')
export class SalesItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    sale_id: number;

    @Column({ type: 'int' })
    product_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    sub_total: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}