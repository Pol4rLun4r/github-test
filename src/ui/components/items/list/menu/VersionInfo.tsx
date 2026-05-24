// mantine
import { Menu } from "@mantine/core";

// icons
import { IconFileDescription } from "@tabler/icons-react";

// redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { setVersion } from "../../../../redux/items/menuSlice";

// types
import { MenuProps } from "./@MenuItem";

// api
import services from "../../../../services/index";

const VersionInfo = ({ itemReferenceId, open }: MenuProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleOpen = async () => {
        const versions = await services.item.getAllVersionByReferenceId(itemReferenceId!);

        if (!versions.success) return console.log(versions.data);

        const hasVersions = versions.data === undefined ? false : versions.data === null ? false : versions.data.length <= 0 ? false : true;

        dispatch(setVersion(hasVersions ? versions.data! : []));
        open();
    };

    return (
        <Menu.Item
            leftSection={<IconFileDescription size={15} />}
            onClick={() => handleOpen()}
        >
            Ver valores do item
        </Menu.Item>
    );
}

export default VersionInfo