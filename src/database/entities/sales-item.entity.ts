import {  Column, Entity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sale } from "./sales.entity";

@Entity('sales_items')
export class SalesItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sale, (sale) => sale.items)
    @JoinColumn({name: 'sale_id'})
    sale: Sale;

    @Column({ type: 'int' })
    product_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column()
    quantity: number;

    @Column({type: 'decimal', nullable: true})
    discount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}