import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../entity/Channel";
import { User } from "../entity/User";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Channel)
    channel: Channel;

    @ManyToOne(() => User)
    author: User;

    @Field()
    @PrimaryColumn()
    authorId: number;

    @Field()
    @PrimaryColumn()
    channelId: number;
    
    @Field()
    @Column()
    content: string;

    @Field()
    @Column("timestamp with time zone", { default: () => "CURRENT_TIMESTAMP" })
    timestamp: Date;

    @Column("boolean", { default: false })
    isDeleted: boolean;
}