import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoice_items",
})
export default class InvoiceItemsModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;
  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  invoiceId: string;
  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;
  @Column({ allowNull: false })
  name: string;
  @Column({ allowNull: false })
  price: number;
  @Column({ allowNull: false })
  createdAt: Date;
  @Column({ allowNull: false })
  updatedAt: Date;
}
