import { Account } from "@/entities";

export type AccountAvatarProps = {
    account: Account | null | undefined,
    handleClick: () => void;
};
