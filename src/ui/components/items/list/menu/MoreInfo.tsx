// mantine
import { Menu } from "@mantine/core";

// icons
import { IconEye } from "@tabler/icons-react";

// types
import { MenuProps } from "./@MenuItem";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { setLinks, setNotes } from "../../../../redux/items/menuSlice";

// api
import services from "../../../../services/index.ts";

interface MenuExtends extends MenuProps {
    notes: ItemReference['notes'];
};

const MoreInfo = ({ open, notes, itemReferenceId }: MenuExtends) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleOpen = async () => {
        const links = await services.item.getReferenceLinks(itemReferenceId!)

        if (!links.success) return console.log(links.data);

        const hasLinks = links.data === undefined ? false : links.data === null ? false : links.data.length <= 0 ? false : true;

        dispatch(setLinks(hasLinks ? links.data! : []))
        dispatch(setNotes(notes));
        open();
    };

    return (
        <Menu.Item
            leftSection={<IconEye size={15} />}
            onClick={() => handleOpen()}
        >
            Ver mais informações
        </Menu.Item>
    )
}

export default MoreInfo