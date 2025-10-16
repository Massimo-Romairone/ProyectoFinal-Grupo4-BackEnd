import { Campaña } from "src/campaña/entities/campaña.entity";
import { Donacion } from "src/donacion/entities/donacion.entity";
import { Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id_nombreUsuario: number;

    @Column({length: 45})
    nombre: string;

    @Column({length: 45})
    apellido: string;

    @Column()
    @Index({unique: true})
    email: string;

    @Column({select: false})
    contraseña: string;

    @OneToOne(() => Campaña, (campania) => campania.usuario)
    campaña: Campaña;

    @OneToMany(() => Donacion, (donacion) => donacion.usuario)
    donaciones: Donacion[];
}
