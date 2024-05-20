import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";

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
      address: {
        city: "City 1",
        state: "State 1",
        zipCode: "000",
        street: "Street 1",
        number: "1",
        complement: "",
      },
    };

    const client = await ClientModel.create({
      id: clientProps.id,
      name: clientProps.name,
      email: clientProps.email,
      city: clientProps.address.city,
      state: clientProps.address.state,
      zipCode: clientProps.address.zipCode,
      street: clientProps.address.street,
      number: clientProps.address.number,
      complement: clientProps.address.complement,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toBe(client.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address.city).toBe(client.city);
    expect(result.address.state).toBe(client.state);
    expect(result.address.zipCode).toBe(client.zipCode);
    expect(result.address.street).toBe(client.street);
    expect(result.address.number).toBe(client.number);
    expect(result.address.complement).toBe(client.complement);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });

  it("should add a client", async () => {
    const clientProps = {
      id: new Id("1"),
      name: "Client 1",
      email: "test@.com",
      document: "000",
      address: new Address({
        city: "City 1",
        state: "State 1",
        zipCode: "000",
        street: "Street 1",
        number: "1",
        complement: "",
      }),
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
    expect(clientFromDb.city).toBe(clientProps.address.city);
    expect(clientFromDb.state).toBe(clientProps.address.state);
    expect(clientFromDb.zipCode).toBe(clientProps.address.zipCode);
    expect(clientFromDb.street).toBe(clientProps.address.street);
    expect(clientFromDb.number).toBe(clientProps.address.number);
    expect(clientFromDb.complement).toBe(clientProps.address.complement);
  });
});
