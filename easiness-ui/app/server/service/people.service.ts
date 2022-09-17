import { In } from "typeorm";
import { ds } from "../config/data-source";
import { ContactNo } from "../entity/contact-no.entity";
import { People } from "../entity/people.entity";
import { ApiError } from "../errors/api-error";
import { ReasonCode } from "../errors/codes";
import { getPage, Pagination } from "../model/page.model";
import { FindPeopleRequest, PeopleRequest, PeopleType } from "../model/people.model";


const repo = ds.getRepository(People)

const validateRequest = async ({id, name, companyName}: PeopleRequest) => {
    const existing = await repo.find({
        where: [{ id }, { name, companyName }],
    })

    if (id) {
        if (existing.filter(el => el.id === id)?.length === 0) {
            throw ApiError.New(ReasonCode.EntityNotFound) 
        }
        if (existing.filter(el => (el.id !== id && (el.name === name && el.companyName === companyName)))?.length > 0) {
            throw ApiError.New(ReasonCode.DupPeopleFound, `People already exists with this name: [${name}] and company: [${companyName}]`)
        }
    } else {
        if (existing.filter(el => (el.name === name && el.companyName === companyName))?.length > 0) {
            throw ApiError.New(ReasonCode.DupPeopleFound, `People already exists with this name: [${name}] and company: [${companyName}]`)
        }
    } 
}

export const peopleService = {
    save: async (req: PeopleRequest) => {
        await validateRequest(req)

        const people = {
            id: req.id,
            name: req.name,
            companyName: req.companyName,
            type: req.type,
            address: req.address,
            email: req.email,
            balance: req.balance,
            contactNoList: req.contactNo?.map((el: string) => ({
                number: el
            } as ContactNo))
        } as People;

        return await repo.save(people)
    },



    findAll: async () => {
        return await repo.find();
    },

    findAllCustomer: async () => {
        return await repo.find({
            where: {
                type: In([PeopleType.BOTH, PeopleType.CUSTOMER])
            }
        });
    },

    findAllSupplier: async () => {
        return await repo.find({
            where: {
                type: In([PeopleType.BOTH, PeopleType.SUPPLIER])
            }
        });
    },

    find: async (params: FindPeopleRequest) => {
        const query = repo.createQueryBuilder("people")
            .leftJoinAndSelect("people.contactNoList", "contact")
            .where("(:name = '' OR LOWER(people.name) LIKE '%' || :name || '%')", { name: params.name })
            .andWhere("(:contactNo = '' OR contact.number LIKE '%' || :contactNo || '%')", { contactNo: params.contactNo })
            
        return getPage(query, params as Pagination);
    },

    findById: async (id: number) => {
        return await repo.find({ where: { id } })[0]
    }

}