import EditRulesetModal from "./EditRulesetModal";
import EditEnvironmentModal from "./EditEnvironmentModal";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import NewRuleset from "./NewRuleset";
import NewEnviroment from "./NewEnviroment";

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
                        {isUserEditingEnvironment ? "environment" : "ruleset"}
                    </DialogTitle>
                    {isUserEditingEnvironment ? (
                        <EditEnvironmentModal
                            closeModal={closeModal}
                            environmentId={environmentId}
                        />
                    ) : (
                        <EditRulesetModal
                            closeModal={closeModal}
                            rulesetId={rulesetId}
                        />
                    )}
                </DialogContent>
            </Dialog>
        );
    } else {
        return (
            <Dialog open={open} onOpenChange={closeModalHandler}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="ruleset">
                        <TabsList className="w-full *:w-full">
                            <TabsTrigger value="ruleset">Ruleset</TabsTrigger>
                            <TabsTrigger value="environment">
                                Environment
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="ruleset">
                            <NewRuleset closeModal={closeModal} />
                        </TabsContent>
                        <TabsContent value="environment">
                            <NewEnviroment closeModal={closeModal} />
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        );
    }
}
