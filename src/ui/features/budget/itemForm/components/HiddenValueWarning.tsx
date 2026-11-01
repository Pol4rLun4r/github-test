import { Badge } from "@mantine/core";
import { useAppSelector } from "@/app/reduxHooks";
import { isHiddenValueWarning } from "../store/itemForm.selectors";
import type { ItemFormScope } from "../store/itemForm.slice";

interface HiddenValueWarningProps {
  scope: ItemFormScope;
}

const HiddenValueWarning = ({ scope }: HiddenValueWarningProps) => {
  const shouldShowWarning = useAppSelector((state) =>
    isHiddenValueWarning(state, scope)
  );

  if (!shouldShowWarning) return null;

  return (
    <Badge
      size="lg"
      c="red"
      pos="absolute"
      top="calc(var(--mantine-spacing-lg) * 0.3)"
      style={{ zIndex: 9999, alignSelf: "center" }}
    >
      Há valores importantes ocultados!
    </Badge>
  );
};

export default HiddenValueWarning;
