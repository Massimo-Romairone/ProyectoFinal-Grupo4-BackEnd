import { Donacion } from "src/donacion/entities/donacion.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Campaña {
    @PrimaryGeneratedColumn()
    id_campania: number;

    @Column({length: 45})
    nombre: string;

    @Column({length: 255})
    descripcion: string;

    @Column({length: 45})
    tipo: string;

    @Column()
    objetivo: number;

    @Column()
    recaudado: number;

    @Column()
    fecha_inicio: Date;

    @Column()
    activo: boolean;

    @OneToOne(() => Usuario, (usuario) => usuario.campaña, { eager: true })
    @JoinColumn({name: 'id_duenio'})
    usuario: Usuario;

    @OneToMany(() => Donacion, (donacion) => donacion.campania)
    donaciones: Donacion[];
}
