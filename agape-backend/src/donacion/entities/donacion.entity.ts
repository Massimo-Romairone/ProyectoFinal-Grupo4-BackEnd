import { Campaña } from "src/campaña/entities/campaña.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Donacion {
    @PrimaryGeneratedColumn()
    id_donacion: number;

    @Column()
    fecha: Date;

    @Column()
    monto: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.donaciones)
    @JoinColumn({name: 'id_usuario'})
    usuario: Usuario;

    @ManyToOne(() => Campaña, (campaña) => campaña.donaciones)
    @JoinColumn({name: 'id_campania'})
    campania: Campaña;
}
