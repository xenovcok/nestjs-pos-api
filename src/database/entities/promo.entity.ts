import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Product } from "./product.entity";

export enum PromoType {
    PERCENTAGE = 'percentage',
    AMOUNT = 'amount'
}

@Entity()
export class Promo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: PromoType
    })
    type: PromoType;

    @Column({nullable: true, unique: true})
    code: number;

    @Column({nullable: true})
    usage_limit: number;

    @Column({default: 0})
    usage_count: number;

    @ManyToMany(() => Product, (product) => product.promos)
    @JoinTable({
        name: 'promo_products', // nama tabel pivot
        joinColumn: { name: 'promo_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
    })
    products: Product[];

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    value: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    min_purchase: number;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    start_date: Date;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    end_date: Date;

    @Column({
        default: true
    })
    is_active: boolean;
}
