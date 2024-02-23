import NewRuleset from "./NewRuleset";
import NewEnviroment from "./NewEnviroment";
import EditRulesetModal from "./EditRulesetModal";
import EditEnvironmentModal from "./EditEnvironmentModal";
import { Dialog } from "@/Components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

export default function ManageContentModal({
    closeModal,
    isUserEditing,
    isUserEditingEnvironment,
    rulesetId = 0,
    environmentId = 0,
    open,
}: {
    closeModal: () => void;
    isUserEditing?: boolean;
    isUserEditingEnvironment?: boolean;
    rulesetId?: number;
    environmentId?: number;
    open: boolean;
}): JSX.Element {
    function closeModalHandler(): void {
        if (
            confirm(
                "Are you sure you want to close this modal? Unsaved changes will be lost."
            )
        ) {
            closeModal();
        }
    }

    if (isUserEditing) {
        return (
            <Dialog open={open} onOpenChange={closeModalHandler}>
                <DialogContent>
                    <DialogTitle>
                        Edit{" "}
                        {isUserEditingEnvironment ? "Environment" : "Ruleset"}
                    </DialogTitle>
                    <Tabs defaultValue="ruleset" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="ruleset">Ruleset</TabsTrigger>
                            <TabsTrigger value="environment">
                                Environment
                            </TabsTrigger>
                            <TabsContent value="ruleset">
                                <EditRulesetModal
                                    closeModal={closeModal}
                                    rulesetId={rulesetId}
                                />
                            </TabsContent>
                            <TabsContent value="environment">
                                <EditEnvironmentModal
                                    closeModal={closeModal}
                                    environmentId={environmentId}
                                />
                            </TabsContent>
                        </TabsList>
                    </Tabs>
                </DialogContent>
            </Dialog>
        );
    } else {
        return (
            <Dialog open={open} onOpenChange={closeModalHandler}>
                <DialogContent>
                    <Tabs defaultValue="ruleset" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="ruleset">Ruleset</TabsTrigger>
                            <TabsTrigger value="environment">
                                Environment
                            </TabsTrigger>
                            <TabsContent value="ruleset">
                                <NewRuleset closeModal={closeModal} />
                            </TabsContent>
                            <TabsContent value="environment">
                                <NewEnviroment closeModal={closeModal} />
                            </TabsContent>
                        </TabsList>
                    </Tabs>
                </DialogContent>
            </Dialog>
        );
    }
}
