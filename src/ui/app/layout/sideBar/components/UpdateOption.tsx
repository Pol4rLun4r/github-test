import { RingProgress, Text } from "@mantine/core";
import { IconAlertTriangle, IconCheck, IconDownload, IconRefresh } from "@tabler/icons-react";

// components
import { SidebarPage } from "./SidebarPage";
import { useAppUpdate } from "./useAppUpdate";

/** Exibe o estado e as ações de atualização na sidebar */
const UpdateOption = () => {
    const update = useAppUpdate();

    const upToDate = update.status === "not-available";
    const unsupported = update.status === "unsupported";

    if (!["available", "downloading", "downloaded", "error", "not-available", "unsupported"].includes(update.status)) {
        return null;
    }

    const downloading = update.status === "downloading";
    const downloaded = update.status === "downloaded";
    const failed = update.status === "error";
    const progress = Math.min(100, Math.max(0, Math.round(update.percent ?? 0)));

    const label = downloading
        ? "Baixando atualização"
        : downloaded
            ? "Instalar atualização"
            : upToDate
                ? "Atualizado"
                : unsupported
                    ? "Atualizações indisponíveis"
            : failed
                ? "Falha na atualização"
                : "Atualização disponível";

    const tooltip = downloading
        ? `Baixando atualização: ${progress}%`
        : downloaded
            ? "Atualização baixada. Clique para fechar o aplicativo e instalar."
            : upToDate
                ? "Você está usando a versão mais recente."
                : unsupported
                    ? "Atualizações disponíveis apenas no Windows."
            : failed
                ? update.error ?? "Não foi possível concluir a atualização."
                : "Há uma atualização disponível. Clique para baixar.";

    const handleClick = async () => {
        try {
            if (update.status === "available") await window.api.updates.download();
            if (update.status === "downloaded") await window.api.updates.install();
        } catch (error) {
            console.error("Failed to perform application update action:", error);
        }
    };

    const iconContent = downloading ? (
        <RingProgress
            size={34}
            thickness={4}
            sections={[{ value: progress, color: "blue" }]}
            label={<Text size="10px" ta="center">{progress}%</Text>}
        />
    ) : failed ? (
        <IconAlertTriangle size={22} stroke={1.8} />
    ) : downloaded ? (
        <IconRefresh size={22} stroke={1.8} />
    ) : upToDate ? (
        <IconCheck size={22} stroke={1.8} />
    ) : (
        <IconDownload size={22} stroke={1.8} />
    );

    return (
        <SidebarPage
            icon={IconDownload}
            iconContent={iconContent}
            label={label}
            tooltip={tooltip}
            onClick={handleClick}
            disabled={downloading || failed || upToDate || unsupported}
            highlighted={!downloading && !failed && !upToDate && !unsupported}
            success={upToDate}
        />
    );
};

export default UpdateOption;
