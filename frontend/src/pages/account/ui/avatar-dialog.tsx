import { Account } from "@/entities";
import { Dialog, DialogContent } from "@mui/material";

export interface AvatarDialogProps {
    open: boolean;
    onClose: () => void;
    account: Account;
}

export const AvatarDialog = ({ open, onClose, account }: AvatarDialogProps) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
        <DialogContent>
            <img
                alt={account.username || 'Аватар'}
                src={account.photo ? `data:image/jpeg;base64,${account.photo}` : '/images/ava.png'}
                style={{ width: '100%', height: 'auto' }}
            />
        </DialogContent>
    </Dialog>
);
