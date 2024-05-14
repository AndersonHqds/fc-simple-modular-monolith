import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/client-adm.factory";

describe("Client Adm Facade", () => {
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

  it("should create a client", async () => {
    const input = {
      id: "1",
      name: "Client 1",
      email: "test@.com",
      address: "Address 1",
    };

    const facade = ClientAdmFacadeFactory.create();

    await facade.createClient(input);

    const client = await ClientModel.findOne({
      where: { id: input.id },
    });

    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });

  it("should find a client", async () => {
    const input = {
      id: "1",
      name: "Client 1",
      email: "test@.com",
      address: "Address 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ClientModel.create(input);

    const facade = ClientAdmFacadeFactory.create();

    const client = await facade.findClient({ id: input.id });

    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });
});
