import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    product_id: number;

    @Column({ type: 'int' })
    user_id: number;

    @Column({ type: 'int' })
    customer_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;

    @Column()
    payment_method: string;

    @CreateDateColumn()
    created_at: Date;
}