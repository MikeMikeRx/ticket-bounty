import { notFound } from "next/navigation";
import { TicketItem } from "@/features/ticket/components/ticket-item";
import { getTicket } from "@/features/ticket/queries/get-ticket";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { homePath } from "@/constants/paths";
import { getComments } from "@/features/comment/queries/get-comments";

export const runtime = "nodejs";

type TicketPageProps = {
    params: Promise<{
        ticketId: string;
    }>
};

const TicketPage = async ({ params }: TicketPageProps) => {
    const { ticketId } = await params;
    const ticketPromise = getTicket(ticketId);
    const commentsPromise = getComments(ticketId);

    const [ticket, comments] = await Promise.all([
        ticketPromise,
        commentsPromise,
    ]);

    if(!ticket) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-col gap-8">
            <Breadcrumbs
                breadcrumbs={[
                    { title: "Tickets", href: homePath() },
                    { title: ticket.title },
                ]}
            />
            <Separator />
            <div className="flex justify-center animate-fade-from-top">
                <TicketItem ticket={ticket} isDetail comments={comments} />
            </div>
        </div>
    );
};

export default TicketPage;