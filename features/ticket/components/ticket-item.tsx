import Link from "next/link";
import clsx from "clsx";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ticketEditPath, ticketPath } from "@/constants/paths";
import { TICKET_ICONS } from "../constants";
import { TicketWithMetadata } from "../types";
import {
    LucideArrowUpRightFromSquare,
    LucideMoreVertical,
    LucidePencil,
} from "lucide-react";
import { toCurrencyFromCent } from "@/utils/currency";
import { TicketMoreMenu } from "./ticket-more-menu";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { Comments } from "@/features/comment/components/comments";
import { CommentWithMetaData } from "@/features/comment/types";

type TicketItemProps = {
    ticket: TicketWithMetadata;
    isDetail?: boolean;
    comments?: CommentWithMetaData[];
};

const TicketItem = async({ ticket, isDetail, comments }: TicketItemProps) => {
    const { user } = await getAuth();
    const isTicketOwner = isOwner(user, ticket);

    const detailButton = (
        <Button variant="outline" size="icon" asChild>
            <Link prefetch href={ticketPath(ticket.id)}>
                <LucideArrowUpRightFromSquare className="h-4 w-4" />
            </Link>
        </Button>
    );

    const editButton = isTicketOwner ? (
        <Button variant="outline" size="icon" asChild>
            <Link prefetch href={ticketEditPath(ticket.id)}>
                <LucidePencil className="h-4 w-4" />
            </Link>
        </Button>
    ) : null;

    const moreMenu = isTicketOwner ? (
        <TicketMoreMenu
            ticket={ticket}
            trigger={
                <Button variant="outline" size="icon">
                    <LucideMoreVertical className="h-4 w-4" />
                </Button>
            }
        />
    ) : null;

    return (
        <div className={clsx("w-full flex flex-col gap-y-4", {
            "max-w-145": isDetail,
            "max-w-105": !isDetail,
            })}
        >
            <div className="flex gap-x-2">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex gap-x-2">
                            <span>{TICKET_ICONS[ticket.status]}</span>
                            <span className="truncate">{ticket.title}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className={clsx("whitespace-break-spaces", {
                            "line-clamp-3": !isDetail,
                            })}
                        >
                            {ticket.content}
                        </span>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <p className="text-sm text-muted-foreground">
                            {ticket.deadline} by {ticket.user.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {toCurrencyFromCent(ticket.bounty)}
                        </p>
                    </CardFooter>
                </Card>
                
                <div className="flex flex-col gap-y-1">
                    {isDetail ? (
                        <>
                            {editButton}
                            {moreMenu}
                        </>
                    ) : (
                        <>
                            {detailButton}
                            {editButton}
                        </>
                    )}
                </div>
            </div>

            {isDetail ? (<Comments ticketId={ticket.id} comments={comments}/>) : null }
        </div>
    );
};

export { TicketItem };