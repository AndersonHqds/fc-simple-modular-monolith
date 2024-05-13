export default interface UsecaseInterface {
  execute(input: any): Promise<any>;
}
