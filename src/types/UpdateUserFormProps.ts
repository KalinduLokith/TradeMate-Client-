import { UserDto } from "./UserDto.ts";

export interface UpdateUserFormProps {
  open: boolean;
  onClose: () => void;
  user: UserDto;
  refresh: () => void;
}
