import { ReactElement } from "react";
import { Drawer } from "vaul";

export default function DrawerComponent({
    openDrawer,
    children,
}: {
    openDrawer: ReactElement;
    children: ReactElement;
}): JSX.Element {
    return (
        <Drawer.Root>
            <Drawer.Trigger asChild>{openDrawer}</Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 backdrop-blur-sm supports-backdrop-blur:bg-black/40" />
                <Drawer.Content className="border-t-2 bg-background flex flex-col rounded-t-xl min-h-[60%] mt-24 fixed bottom-0 left-0 right-0 outline-none focus:outline-none active:outline-none">
                    <div className="p-4 rounded-t-[10px] flex-1">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
                        {children}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
