// mantine
import { ActionIcon, ActionIconProps, Group } from "@mantine/core";

// style
import classes from './FrameBar.module.css';

// service
import services from "@/services";

// icons
import { IconMaximize, IconMinus, IconX } from '@tabler/icons-react';

// components
import LeftTitle from "./LeftTitle";
import CenterTitle from "./CenterTitle";

// interface para definir os props de actionIcon
interface ActionProps extends HTMLOrSVGElement, ActionIconProps { }

const FrameBar = () => {
  const window = services.window;

  // definição dos actionsIcon
  const iconSize = '1.2rem'
  const actionIconProps: Partial<ActionProps> = {
    size: 'lg',
    radius: 'lg',
    variant: 'transparent',
    tabIndex: -1,
    className: classes.buttons
  }

  return (
    <div className={classes.frameBar}>
      <LeftTitle />
      <CenterTitle />

      <Group gap={2}>
        <ActionIcon
          {...actionIconProps}
          aria-label="Minimizar"
          onClick={async () => await window.minimize()}
        >
          <IconMinus size={iconSize} />
        </ActionIcon>
        <ActionIcon
          {...actionIconProps}
          aria-label="Maximizar ou restaurar"
          onClick={async () => await window.maximizeToggle()}
        >
          <IconMaximize size={iconSize} />
        </ActionIcon>
        <ActionIcon
          {...actionIconProps}
          aria-label="Fechar"
          onClick={async () => await window.close()}
        >
          <IconX size={iconSize} />
        </ActionIcon>
      </Group>
    </div>
  )
}

export default FrameBar;