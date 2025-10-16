import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
