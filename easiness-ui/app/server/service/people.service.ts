import Big from "big.js";
import { In, Repository } from "typeorm";
import { ds } from "../config/data-source";
import { ContactNo } from "../entity/contact-no.entity";
import { People } from "../entity/people.entity";
import { ApiError } from "../errors/api-error";
import { ReasonCode } from "../errors/codes";
import { ChartPoint } from "../model/dashboard.model";
import { Invoice } from "../model/invoice.model";
import { getPage, Pagination } from "../model/page.model";
import { Payment } from "../model/payment.model";
import { FindPeopleRequest, PeopleRequest, PeopleType } from "../model/people.model";
import { PurchaseOrder } from "../model/purchase-order.model";
import { utils } from "../utils/utils";


const repo = ds.getRepository(People)

const validateRequest = async ({ id, name, companyName }: PeopleRequest) => {
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
        return await repo.findOne({ where: { id } })
    },

    updateSupplierBalance: async (req: PurchaseOrder) => {
        const debt = req.totalCost().sub(req.totalPaymentDone())
        await updatePeopleBalance(repo, req.supplier, utils.negate(debt))
    },

    updateCustomerBalance: async (repo: Repository<People>, req: Invoice) => {
        const due = req.totalPrice().sub(req.totalPaymentReceived())
        await updatePeopleBalance(repo, req.customer, due)
    },

    adjustPayment: async (repo: Repository<People>, id: number, payments: Payment[]) => {
        let amount = new Big(0)
        for (const payment of payments) {
            if (payment.fromAccount) {
                amount = amount.add(payment.amount.abs())
            } else if (payment.toAccount) {
                amount = amount.add(utils.negate(payment.amount.abs()))
            }
        }

        await updatePeopleBalance(repo, id, amount)
    },

    getTopDuePeople: async (count: number) => {
        const topDuePeople = await repo.createQueryBuilder("ppl").
            select(["ppl.name as label", "ppl.balance as value"]).
            where("ppl.balance>0").
            orderBy("ppl.balance", "DESC").
            limit(count).
            getRawMany() as ChartPoint[]
        console.log(topDuePeople);

        return topDuePeople
    },

    getTopDebtPeople: async (count: number) => {
        const topDebtPeople = await repo.createQueryBuilder("ppl").
            select(["ppl.name as label", "ppl.balance as value"]).
            where("ppl.balance<=0").
            orderBy("ppl.balance", "ASC").
            limit(count).
            getRawMany() as ChartPoint[]
        console.log(topDebtPeople);

        return topDebtPeople
    }
}

async function updatePeopleBalance(repo: Repository<People>, id: number, amount: Big) {
    const people = await repo.findOneBy({ id })
    if (people) {
        people.balance = people.balance.add(amount)
        await repo.save(people)
    } else {
        throw ApiError.New(ReasonCode.EntityNotFound)
    }
}