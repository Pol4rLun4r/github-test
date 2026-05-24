// style
import classes from './ComingSoon.module.css';

// mantine
import { Stack, Title } from '@mantine/core';


// icons
import { IconBarrierBlock } from '@tabler/icons-react';

const ComingSoon = () => {
    return (
        <div className={classes.container}>
            <Stack align="center" gap="xs">
                <IconBarrierBlock size={200} stroke={1.5} />
                <Title>Coming Soon</Title>
            </Stack>
        </div>
    )
}

export default ComingSoon