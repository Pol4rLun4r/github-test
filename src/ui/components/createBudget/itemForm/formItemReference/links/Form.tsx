// mantine
import { Button, Group, Stack, TextInput, } from "@mantine/core"

// redux
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../../../../redux/store"
import { resetReferenceLink, setReferenceLink } from "../../../../../redux/createBudget/items/ReferenceLinkFormSlice.ts"
import { addLink, type ItemFormScope } from "../../../../../redux/createBudget/items/itemFormSlice";

const Form = ({ scope }: { scope: ItemFormScope }) => {
    const dispatch = useDispatch<AppDispatch>()
    const referenceLink = useSelector((state: RootState) => state.createBudget.referenceLinkForm[scope]);

    const handleAddLink = () => {
        const data: Partial<ReferenceLink> = {
            content: referenceLink.content,
        };

        const hasUrl = /(https?:\/\/[^\s]+)/.test(data.content!);

        if(!hasUrl) return;

        if (data.content === undefined) return dispatch(resetReferenceLink(scope));

        if (data.content?.length <= 0) return dispatch(resetReferenceLink(scope));

        dispatch(addLink({ scope, link: data }));
        dispatch(resetReferenceLink(scope));
    }

    return (
        <Stack gap="md">
            <Group style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: "flex-end" }}>
                <TextInput
                    label="Link de referencia/preço"
                    placeholder="https://www.exemplo-de-link.com/pt-br/home"
                    radius='lg'
                    w={'80%'}
                    spellCheck={false}

                    value={referenceLink.content}
                    onChange={(e) => dispatch(setReferenceLink({ scope, content: e.currentTarget.value }))}
                />
                <Button radius='lg' variant="outline" onClick={() => handleAddLink()}>adicionar</Button>
            </Group>
        </Stack>
    )
}

export default Form;