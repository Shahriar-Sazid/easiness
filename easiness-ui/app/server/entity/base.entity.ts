import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export class Base {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @VersionColumn()
    version: number;
}