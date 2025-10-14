import { Avatar, keyframes } from '@mui/material';
import { AccountAvatarProps } from './account-avatar-props';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 36, 0, 0.8);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(219, 20, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(155, 17, 30, 0);
  }
`;

export const AccountAvatar = ({ account, onClick }: AccountAvatarProps) => {

  if (account == null || account == undefined) {
    return (
      <img
        src="/images/human_error.png"
        height={56}
        width={56}
        alt="Программная ошибка передачи пользовательских данных. Обратитесь к разработчикам."
      />);
  }

  return (
    <Avatar
      sx={{
        width: 56,
        height: 56,
        cursor: "pointer",
        animation: account.is_tracking ? `${pulse} 1s infinite ease` : undefined
      }}
      alt={account?.main_username}
      src={`data:image/jpeg;base64,${account?.photo}`}
      onClick={onClick}
    >
      <img
        src="/images/ava.png"
        height={56}
        width={56}
        alt={account?.main_username}
      />
    </Avatar>
  );
};

AccountAvatar.displayName = 'AccountAvatar';
