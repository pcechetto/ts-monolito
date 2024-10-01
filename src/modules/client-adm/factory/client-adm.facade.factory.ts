import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {
  static create(): ClientAdmFacade {
    const clientRepository = new ClientRepository();
    const clientAddUsecase = new AddClientUsecase(clientRepository);
    const clientFindUsecase = new FindClientUsecase(clientRepository);
    const facade = new ClientAdmFacade({
      addUsecase: clientAddUsecase,
      findUsecase: clientFindUsecase,
    });
    return facade;
  }
}
