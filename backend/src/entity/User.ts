import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../entity/Channel";
import { Message } from "../entity/Message";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { unique: true })
  email: string;

  @Field()
  @Column("text", { unique: true })
  username: string;

  @Column()
  password: string;

  @Field()
  @Column("text", { nullable: true })
  avatar: string;

  @Field()
  @Column("timestamp with time zone", { default: () => "CURRENT_TIMESTAMP"})
  dateRegistered: Date;

  @Column("boolean", { default: false })
  confirmedEmail: boolean;

  @ManyToMany(() => Channel, channel => channel.members)
  channels: Channel[]; 

  @OneToMany(() => Message, message => message.author)
  messages: Message[];
}