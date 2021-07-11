import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "../entity/Message";
import { User } from "../entity/User";

@ObjectType()
@Entity()
export class Channel extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, user => user.channels, { cascade: true })
    @JoinTable()
    members: User[]; 

    @OneToMany(() => Message, message => message.channel)
    @JoinColumn()
    messages: Message[]; 
}