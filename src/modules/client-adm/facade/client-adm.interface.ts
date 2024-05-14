export interface FlindClientFacadeInputDto {
  id: string;
}

export interface FindClientFacadeOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddClientFacadeInputDto {
  id?: string;
  name: string;
  email: string;
  address: string;
}

export interface AddClientFacadeOutputDto {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export default interface ClientAdmFacadeInterface {
  createClient(
    input: AddClientFacadeInputDto
  ): Promise<AddClientFacadeOutputDto>;
  findClient(
    input: FlindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto>;
}
