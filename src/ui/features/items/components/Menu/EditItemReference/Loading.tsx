import { Skeleton, Stack } from "@mantine/core";

const Loading = () => {
    return (
        <Stack>
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={112} />
        </Stack>
    );
}

export default Loading;