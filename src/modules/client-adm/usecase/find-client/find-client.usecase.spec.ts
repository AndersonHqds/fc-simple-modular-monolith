import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUsecase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "name 1",
  email: "email 1",
  document: "document 1",
  address: new Address({
    city: "city 1",
    complement: "complement 1",
    number: "1",
    state: "state 1",
    street: "street 1",
    zipCode: "zipCode 1",
  }),
});

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn().mockReturnValue(Promise.resolve(client)),
});

describe("AddClientUsecase", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUsecase(repository);

    const result = await usecase.execute("1");

    expect(repository.find).toBeCalled();
    expect(result.id.id).toBe("1");
    expect(result.name).toBe("name 1");
    expect(result.email).toBe("email 1");
    expect(result.address).toBe("address 1");
  });
});
