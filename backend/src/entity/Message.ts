import { Field, ID, ObjectType } from "type-graphql"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { Channel } from "./Channel";
import { User } from "./User";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Channel, channel => channel.messages)
    channel: Channel;

    @ManyToOne(() => User, user => user.messages)
    author: User;

    @Field()
    @Column()
    content: string;

    @Field()
    @Column("timestamp with time zone", { default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date;
    
    @Column("boolean", { default: false })
    deleted: boolean;
}