"use client";

import { BottomSheet } from "@/apps/web-user/common/components/bottom-sheets/BottomSheet";
import { BANK_LIST, BankItem } from "@/apps/web-user/common/constants/banks.constant";

interface BankSelectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bank: BankItem) => void;
}

export function BankSelectBottomSheet({ isOpen, onClose, onSelect }: BankSelectBottomSheetProps) {
  const handleSelect = (bank: BankItem) => {
    onSelect(bank);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="은행 선택">
      <ul className="grid grid-cols-2 gap-y-2 gap-x-2.5 px-5 py-5">
        {BANK_LIST.map((bank, index) => (
          <li key={`${bank.value}-${index}`}>
            <button
              type="button"
              onClick={() => handleSelect(bank)}
              className="flex items-center gap-2 w-full text-left p-2"
            >
              {bank.imageUrl ? (
                <img
                  src={bank.imageUrl}
                  alt={bank.label}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="w-8 h-8 rounded-full bg-gray-100" aria-hidden />
              )}
              <span className="text-sm text-gray-900">{bank.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
