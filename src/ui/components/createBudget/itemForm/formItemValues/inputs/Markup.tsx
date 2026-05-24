// mantine
import { Select } from "@mantine/core";

// icons
import { IconPercentage } from "@tabler/icons-react";

// hooks
import { markupList } from "../../../../../utils/markupList";

// redux
import { RootState, AppDispatch } from "../../../../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { ItemFormScope, setVersionField } from "../../../../../redux/createBudget/items/itemFormSlice";

const Markup = ({ scope }: { scope: ItemFormScope }) => {
    const itemData = useSelector((state: RootState) => state.createBudget.itemForm[scope].item_version);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <Select
            w={'45%'}

            label="Markup"
            radius='lg'
            placeholder="00"
            withAsterisk
            leftSection={<IconPercentage size={18} />}

            searchable
            clearable
            selectFirstOptionOnChange
            selectFirstOptionOnDropdownOpen

            defaultValue={'40.3'}

            data={[
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                { group: 'Padrão', items: markupList as any },
                { group: 'Customizado', items: ['00'] },
            ]}

            // configurações do valor do input
            value={itemData.markup}
            onChange={(value) =>
                dispatch(setVersionField({ scope, key: 'markup', value: value as string }))
            }
        />
    )
}

export default Markup