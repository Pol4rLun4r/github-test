import {
    ActionIcon,
    Anchor,
    Badge,
    Card,
    CopyButton,
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Tooltip,
    UnstyledButton,
} from "@mantine/core";
import {
    IconBarcode,
    IconCheck,
    IconClock,
    IconCopy,
    IconExternalLink,
    IconFileText,
    IconHash,
    IconLink,
    IconPackage,
} from "@tabler/icons-react";

import { useAppSelector } from "@/app/reduxHooks";

const getLinkHref = (content: string) => {
    const value = content.trim();
    if (!value) return null;

    try {
        const href = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
        const url = new URL(href);

        return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : null;
    } catch {
        return null;
    }
};

interface CopyFieldProps {
    label: string;
    value?: string;
    icon: React.ReactNode;
}

const CopyField = ({ label, value, icon }: CopyFieldProps) => (
    <Card withBorder padding="sm" radius="md">
        {value ? (
            <CopyButton value={value} timeout={1200}>
                {({ copied, copy }) => (
                    <UnstyledButton
                        type="button"
                        onClick={copy}
                        aria-label={`Copiar ${label}`}
                        style={{ display: "block", width: "100%", textAlign: "left" }}
                    >
                        <Group gap="sm" wrap="nowrap" justify="space-between">
                            <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                                <ThemeIcon variant="light" color="violet" radius="md">
                                    {icon}
                                </ThemeIcon>
                                <Stack gap={2} style={{ minWidth: 0 }}>
                                    <Text size="xs" c="dimmed" fw={600}>
                                        {label}
                                    </Text>
                                    <Text size="sm" style={{ overflowWrap: "anywhere" }}>
                                        {value}
                                    </Text>
                                </Stack>
                            </Group>
                            <Tooltip label={copied ? "Copiado" : "Clique para copiar"} withArrow>
                                <ThemeIcon variant="light" color={copied ? "teal" : "gray"} aria-hidden="true">
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ThemeIcon>
                            </Tooltip>
                        </Group>
                    </UnstyledButton>
                )}
            </CopyButton>
        ) : (
            <Group gap="sm" wrap="nowrap">
                <ThemeIcon variant="light" color="gray" radius="md">
                    {icon}
                </ThemeIcon>
                <Stack gap={2}>
                    <Text size="xs" c="dimmed" fw={600}>
                        {label}
                    </Text>
                    <Text size="sm" c="dimmed">Não informado</Text>
                </Stack>
            </Group>
        )}
    </Card>
);

const ItemReference = () => {
    const item = useAppSelector((state) => state.items.itemDetails.itemWithReferenceLinks);

    if (!item) {
        return (
            <Card withBorder padding="xl" radius="lg">
                <Stack align="center" gap="xs">
                    <ThemeIcon size={44} radius="xl" variant="light" color="gray">
                        <IconPackage size={22} />
                    </ThemeIcon>
                    <Text fw={600}>Nenhum item selecionado</Text>
                    <Text size="sm" c="dimmed" ta="center">
                        Selecione um item para visualizar seus dados de referência.
                    </Text>
                </Stack>
            </Card>
        );
    }

    const fields = [
        { label: "Descrição", value: item.description, icon: <IconFileText size={17} /> },
        { label: "Código interno", value: item.internal_code, icon: <IconHash size={17} /> },
        { label: "Código do fabricante", value: item.manufacturer_code, icon: <IconBarcode size={17} /> },
        { label: "NCM", value: item.ncm, icon: <IconPackage size={17} /> },
        { label: "Identificador", value: item.id !== undefined ? String(item.id) : undefined, icon: <IconHash size={17} /> },
        { label: "Observações", value: item.notes, icon: <IconFileText size={17} /> },
        { label: "Criado em", value: item.created_at, icon: <IconClock size={17} /> },
        { label: "Atualizado em", value: item.updated_at, icon: <IconClock size={17} /> },
    ];
    const links = item.reference_links ?? [];

    return (
        <Stack gap="md">
            <Stack gap="xs">
                <Text size="sm" fw={600}>Dados cadastrados</Text>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                    {fields.map((field) => (
                        <CopyField key={field.label} {...field} />
                    ))}
                </SimpleGrid>
            </Stack>

            <Stack gap="xs">
                <Group gap="xs">
                    <ThemeIcon size="sm" variant="light" color="violet" radius="xl">
                        <IconLink size={14} />
                    </ThemeIcon>
                    <Text size="sm" fw={600}>Links de referência</Text>
                    <Badge size="sm" variant="light" color="gray">
                        {links.length}
                    </Badge>
                </Group>

                {links.length > 0 ? (
                    <Stack gap="xs">
                        {links.map((link, index) => {
                            const href = getLinkHref(link.content);

                            return (
                                <Card key={link.id ?? `${link.content}-${index}`} withBorder padding="sm" radius="md">
                                    <Group justify="space-between" gap="sm" wrap="nowrap">
                                        <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                                            <ThemeIcon variant="light" color="blue" radius="md">
                                                <IconExternalLink size={17} />
                                            </ThemeIcon>
                                            {href ? (
                                                <Anchor
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="sm"
                                                    style={{ overflowWrap: "anywhere" }}
                                                >
                                                    {link.content}
                                                </Anchor>
                                            ) : (
                                                <Text size="sm" style={{ overflowWrap: "anywhere" }}>
                                                    {link.content}
                                                </Text>
                                            )}
                                        </Group>
                                        <CopyButton value={link.content} timeout={1200}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? "Copiado" : "Copiar link"} withArrow>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color={copied ? "teal" : "gray"}
                                                        onClick={copy}
                                                        aria-label="Copiar link de referência"
                                                    >
                                                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    </Group>
                                </Card>
                            );
                        })}
                    </Stack>
                ) : (
                    <Card withBorder padding="md" radius="md">
                        <Text size="sm" c="dimmed" ta="center">
                            Este item ainda não possui links de referência.
                        </Text>
                    </Card>
                )}
            </Stack>
        </Stack>
    );
};

export default ItemReference;
