import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalSaveButton,
  ModalTriggerButton,
} from "@/components/ui/animated-modal";
import { ReactNode } from "react";

export function CustomModal({
  children,
  onSave,
  title,
  excludeRefs,
  disableOutsideClick = false,
  className,
}: {
  children: ReactNode;
  onSave: () => void;
  title: string;
  excludeRefs?: React.RefObject<HTMLElement>[];
  disableOutsideClick?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Modal>
        <ModalTriggerButton text={title} />
        <ModalBody
          excludeRefs={excludeRefs}
          disableOutsideClick={disableOutsideClick}
        >
          <ModalContent>{children}</ModalContent>
          <ModalFooter className="gap-4">
            <ModalSaveButton onSave={onSave} />
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default CustomModal;
