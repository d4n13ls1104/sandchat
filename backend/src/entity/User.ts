import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column("text", { unique: true })
    email: string;

    @Field()
    @Column("text", { unique: true })
    username: string;

    @Column()
    password: string;

    @Field()
    @Column("text", { default: "none" })
    avatar: string;

    @Column("timestamp with time zone", { default: () => "CURRENT_TIMESTAMP" })
    date_registered: Date;

    @Column("bool", { default: false })
    confirmed: boolean
}