import { IpcMainInvokeEvent } from "electron";
import { documentService } from "../service/document.service";
import { DocumentType } from "../entity/document.entity";
import { FindDocumentReq } from "../model/document.model";
import { utils } from "../utils/utils";

export const documentHandler = {
  findAll: async (
    event: IpcMainInvokeEvent,
    query: { from?: string; to?: string; type?: string; peopleName?: string }
  ) => {
    const findRequest: FindDocumentReq = {
        from: query.from ? new Date(query.from) : new Date("2022-01-01"),
        to: query.to ? new Date(query.to) : new Date("2099-01-01"),
        type: query.type ? DocumentType[query.type] : undefined,
        peopleName: query.peopleName ?? "",
        page: "",
        pageSize: ""
    };

    const res = await documentService.find(findRequest);
    return utils.simpleClone(res);
  },

  getDetails: async (event: IpcMainInvokeEvent, id: number) => {
    const res = await documentService.getDetails(id);
    return utils.simpleClone(res);
  },
};
