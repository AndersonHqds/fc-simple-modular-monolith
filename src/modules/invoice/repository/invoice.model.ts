import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import InvoiceItemsModel from "./invoice-items.model";

@Table({
  tableName: "invoices",
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;
  @Column({ allowNull: false })
  name: string;
  @Column({ allowNull: false })
  document: string;
  @HasMany(() => InvoiceItemsModel)
  items: InvoiceItemsModel[];
  @Column({ allowNull: false })
  street: string;
  @Column({ allowNull: false })
  number: string;
  @Column({ allowNull: false })
  complement: string;
  @Column({ allowNull: false })
  city: string;
  @Column({ allowNull: false })
  state: string;
  @Column({ allowNull: false })
  zipCode: string;
  @Column({ allowNull: false })
  createdAt: Date;
}
