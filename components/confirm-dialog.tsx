import {
  cloneElement,
  useActionState,
  useEffect,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactElement,
} from "react";
import { useActionFeedback } from "./form/hooks/use-action-feedback";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

type TriggerProps = { onClick?: MouseEventHandler<HTMLElement> };

type UseConfirmDialogArgs = {
  title?: string;
  description?: string;
  action: () => Promise<ActionState>;
  trigger: ReactElement<TriggerProps> | ((isLoading: boolean) => ReactElement<TriggerProps>);
  onSuccess?: (actionState: ActionState) => void;
};

const useConfirmDialog = ({
    title = "Are you absolutely sure ?",
    description = "This action cannot be undone. Make sure you understand the consequences.",
    action,
    trigger,
    onSuccess,
}: UseConfirmDialogArgs) => {
    const [isOpen, setIsOpen] = useState(false);

    const [actionState, formAction, isPending] = useActionState(
        action,
        EMPTY_ACTION_STATE
    );

    const dialogTrigger = cloneElement(
        typeof trigger === "function" ? trigger(isPending) : trigger, 
        {
        onClick: () => setIsOpen((state) => !state),
        }
    );

    useActionFeedback(actionState, {
        onSuccess: (actionState) => {
            if (actionState.message) {
                toast.success(actionState.message);
            }

            onSuccess?.(actionState);
        },
        onError: (actionState) => {
            if (actionState.message) {
                toast.error(actionState.message);
            }
        },
    });

    const toastRef = useRef<string | number | null>(null);

    useEffect(()=> {
        if (isPending) {
            toastRef.current = toast.loading("Deleting...");
        } else if (toastRef.current) {
            toast.dismiss(toastRef.current);
        }

        return () => {
            if (toastRef.current) {
                toast.dismiss(toastRef.current);
            }
        };
    }, [isPending]);

    const dialog = (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>        
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <form action={formAction}>
                            <Button type="submit" >
                                Confirm
                            </Button>
                        </form>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return[dialogTrigger, dialog] as const;
};

export { useConfirmDialog };