import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne,
    JoinColumn,
    ManyToMany
} from "typeorm";
import { Category } from "./category.entity";
import { Promo } from "./promo.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ unique: true })
    sku: string;

    @ManyToOne(() => Category, (category) => category.products, { eager: true })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    image_url: string;

    @Column({ nullable: true })
    discounted_price: number;

    @ManyToMany(() => Promo, (promo) => promo.products)
    promos: Promo[];

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}


