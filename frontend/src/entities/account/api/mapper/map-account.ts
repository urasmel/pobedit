import { Account } from "../../model/Account";
import { AccountDto } from "../dto/account.dto";


export const mapAccount = (dto: AccountDto): Account => ({
    tlg_id: dto.tlg_id,
    username: dto.username,
    photo: dto.photo,
});
