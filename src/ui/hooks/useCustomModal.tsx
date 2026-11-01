// mantine
import { Modal, type ModalProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";

interface UseModalProps extends Omit<ModalProps, "opened" | "onClose" | "children"> {
    children: ReactNode | ((handlers: { close: () => void }) => ReactNode);
}

const useCustomModal = ({ children, ...modalProps }: UseModalProps) => {
    const [opened, handlers] = useDisclosure(false);

    const modal = (
        <Modal
            // mantine modal props
            {...modalProps}

            // open and close
            opened={opened}
            onClose={handlers.close}
        >
            {typeof children === "function" ? children(handlers) : children}
        </Modal>
    )

    return { modal, handlers }
}

export default useCustomModal;