import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ClientRepository unit test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a client", async () => {
    const clientProps = {
      id: "1",
      name: "Client 1",
      email: "test@.com",
      address: "Address 1",
    };

    const client = await ClientModel.create({
      id: clientProps.id,
      name: clientProps.name,
      email: clientProps.email,
      address: clientProps.address,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toBe(client.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toBe(client.address);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });

  it("should add a client", async () => {
    const clientProps = {
      id: new Id("1"),
      name: "Client 1",
      email: "test@.com",
      address: "Address 1",
    };
    const client = new Client(clientProps);
    const repository = new ClientRepository();
    await repository.add(client);
    const clientFromDb = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(clientFromDb.id).toBe(clientProps.id.id);
    expect(clientFromDb.name).toBe(clientProps.name);
    expect(clientFromDb.email).toBe(clientProps.email);
    expect(clientFromDb.address).toBe(clientProps.address);
  });
});
