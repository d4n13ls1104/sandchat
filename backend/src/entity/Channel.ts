import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, OneToMany, JoinColumn } from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@ObjectType()
@Entity()
export class Channel extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, user => user.channels)
    members: User[];

    @OneToMany(() => Message, message => message.channel)
    @JoinColumn()
    messages: Message[];
}