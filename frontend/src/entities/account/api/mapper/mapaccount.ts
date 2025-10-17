import { Account } from "../../model/Account";
import { AccountDto } from "../dto/Account.dto";


export const mapAccount = (dto: AccountDto): Account => ({
    tlg_id: dto.tlg_id,
    main_username: dto.main_username,
    is_active: dto.is_active,
    is_bot: dto.is_bot,
    username: dto.username,
    phone: dto.phone,
    first_name: dto.first_name,
    last_name: dto.last_name,
    bio: dto.bio,
    photo: dto.photo,
    is_tracking: dto.is_tracking
});
