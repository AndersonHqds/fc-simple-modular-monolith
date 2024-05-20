import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import AddClientUsecase from "./add-client.usecase";

const MockRepository = () => ({
  add: jest.fn(),
  find: jest.fn(),
});

describe("AddClientUsecase", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const usecase = new AddClientUsecase(repository);

    const result = await usecase.execute({
      address: {
        city: "city 1",
        complement: "complement 1",
        number: "1",
        state: "state 1",
        street: "street 1",
        zipCode: "zipCode 1",
      },
      document: "000",
      email: "email 1",
      name: "name 1",
    });

    expect(repository.add).toBeCalled();
    expect(result.id).toStrictEqual(expect.any(String));
    expect(result.name).toBe("name 1");
    expect(result.email).toBe("email 1");
    expect(result.address).toBe("address 1");
  });
});
