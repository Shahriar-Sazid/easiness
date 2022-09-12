import { In } from "typeorm";
import { ds } from "../config/data-source";
import { ContactNo } from "../entity/contact-no.entity";
import { People } from "../entity/people.entity";
import { getPage, Pagination } from "../model/page.model";
import { FindPeopleRequest, PeopleRequest, PeopleType } from "../model/people.model";


const repo = ds.getRepository(People)

const validateRequest = async (req: PeopleRequest) => {
    const existing = await repo.find({
        where: [{ id: req.id }, { name: req.name, companyName: req.companyName }],
    })

    if (!existing && req.id) {
        return 2
    } else if (existing?.length > 0) {
        if (!req.id) {
            return 3
        }
        for (const el of existing) {
            if (el.id !== req.id) {
                return 3
            }
        }
    }
    return 1
}

export const peopleService = {
    save: async (req: PeopleRequest) => {
        const reqStatus = await validateRequest(req)
        switch (reqStatus) {
            case 2:
                throw new Error("No Customer/Supplier with this id found!")
            case 3:
                throw new Error("Customer/Supplier with this name and company already exists!")
        }

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