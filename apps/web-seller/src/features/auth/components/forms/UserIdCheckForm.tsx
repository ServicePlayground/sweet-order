import { useState } from "react";
import { Input } from "@/apps/web-seller/common/components/inputs/Input";
import { Button } from "@/apps/web-seller/common/components/buttons/Button";
import { useCheckUserIdDuplicate } from "@/apps/web-seller/features/auth/hooks/queries/useAuth";
import { AUTH_ERROR_MESSAGES } from "@/apps/web-seller/features/auth/constants/auth.constant";
import { isValidUserId } from "@/apps/web-seller/common/utils/validator.util";

interface UserIdCheckFormProps {
  userId: string;
  isUserIdAvailable: boolean;
  setUserId: (value: string) => void;
  setIsUserIdAvailable: (isAvailable: boolean) => void;
}

export default function UserIdCheckForm({
  userId,
  isUserIdAvailable,
  setUserId,
  setIsUserIdAvailable,
}: UserIdCheckFormProps) {
  const checkUserIdDuplicateMutation = useCheckUserIdDuplicate();
  const [userIdError, setUserIdError] = useState("");

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setUserId(inputValue);
    setIsUserIdAvailable(false);

    if (!isValidUserId(inputValue)) {
      setUserIdError(AUTH_ERROR_MESSAGES.USER_ID_INVALID_FORMAT);
      return;
    }

    setUserIdError("");
  };

  const handleCheckUserIdDuplicate = async () => {
    const result = await checkUserIdDuplicateMutation.mutateAsync(userId);
    setIsUserIdAvailable(result.available);
  };

  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
      <Input
        label="아이디"
        type="text"
        name="userId"
        value={userId}
        onChange={handleUserIdChange}
        error={userIdError}
        placeholder="아이디를 입력하세요"
        style={{ flex: 1 }}
      />
      <Button
        type="button"
        onClick={handleCheckUserIdDuplicate}
        disabled={
          !userId || !!userIdError || isUserIdAvailable || checkUserIdDuplicateMutation.isPending
        }
        style={{
          minWidth: "100px",
          height: "48px",
          borderRadius: "6px",
          alignSelf: "flex-end",
        }}
      >
        {checkUserIdDuplicateMutation.isPending ? "중복확인 중..." : "중복확인"}
      </Button>
    </div>
  );
}

