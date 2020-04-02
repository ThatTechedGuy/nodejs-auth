import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class User {
  @PrimaryGeneratedColumn("uuid")
  id;

  @Column({
    type: "text",
    unique: true
  })
  email;

  @Column({
    type: "text",
    unique: true
  })
  username;

  @Column("text")
  fullName;

  @Column("text")
  hash;

  @Column("bool")
  isConfirmed = false;
}

export default User;