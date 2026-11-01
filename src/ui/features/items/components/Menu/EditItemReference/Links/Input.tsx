import { useEffect, useRef } from "react";

// mantine
import { ActionIcon, Group, ScrollArea, Stack, Text, TextInput, Tooltip } from "@mantine/core";

// icons
import { IconTrash } from "@tabler/icons-react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { removeReferenceLink, updateReferenceLink } from "@/features/items/store/editItemReference.slice";

const Input = () => {
  const dispatch = useAppDispatch();
  const referenceLinks = useAppSelector((state) => state.items.editItemReference?.reference_links ?? []);

  const linksViewportRef = useRef<HTMLDivElement>(null);
  const previousLinkCount = useRef(referenceLinks.length);

  useEffect(() => {
    const linkCount = referenceLinks.length;

    if (linkCount > previousLinkCount.current) {
      linksViewportRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }

    previousLinkCount.current = linkCount;
  }, [referenceLinks.length]);

  if (referenceLinks.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="xs">
        Nenhum link cadastrado. Adicione um link de referência ou preço.
      </Text>
    );
  }

  return (
    <ScrollArea h={88} type="auto" offsetScrollbars viewportRef={linksViewportRef}>
      <Stack gap="xs" pr="xs">
        {referenceLinks.map((link, index) => (
          <Group key={link.id ?? `new-link-${index}`} wrap="nowrap">
            <TextInput
              aria-label={`Link de referência ${index + 1}`}
              placeholder="https://exemplo.com"
              type="url"
              spellCheck={false}
              radius="lg"
              style={{ flex: 1 }}
              value={link.content ?? ""}
              onChange={(event) =>
                dispatch(updateReferenceLink({
                  index,
                  content: event.currentTarget.value,
                }))
              }
            />
            <Tooltip label="Remover link">
              <ActionIcon
                type="button"
                color="red"
                variant="light"
                size="lg"
                aria-label={`Remover link ${index + 1}`}
                onClick={() => dispatch(removeReferenceLink(index))}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ))}
      </Stack>
    </ScrollArea>
  );
};

export default Input;