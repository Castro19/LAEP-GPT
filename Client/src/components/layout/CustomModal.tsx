import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalSaveButton,
  ModalTriggerButton,
} from "@/components/ui/animated-modal";
import { ReactNode } from "react";

export function AnimatedModalDemo({
  children,
  onSave,
  title,
  excludeRefs,
}: {
  children: ReactNode;
  onSave: () => void;
  title: string;
  excludeRefs?: React.RefObject<HTMLElement>[];
}) {
  console.log(excludeRefs);
  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTriggerButton text={title} />
        <ModalBody excludeRefs={excludeRefs}>
          <ModalContent>{children}</ModalContent>
          <ModalFooter className="gap-4">
            <ModalSaveButton onSave={onSave} />
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
