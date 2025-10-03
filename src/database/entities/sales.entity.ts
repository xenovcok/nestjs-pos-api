import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { SalesItem } from "./sales-item.entity";

export enum SaleStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    user_id: number;

    @OneToMany(() => SalesItem, (item) => item.sale, { cascade: true })
    items: SalesItem[];

    @Column()
    invoice_no: string;

    @Column({ type: 'int' })
    customer_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price: number;

    @Column()
    payment_method: string;

    @Column({ nullable: true })
    promo_id: number;

    @Column({
        type: 'enum',
        enum: SaleStatus,
        default: SaleStatus.PENDING
    })
    status: SaleStatus;

    @CreateDateColumn()
    created_at: Date;
}