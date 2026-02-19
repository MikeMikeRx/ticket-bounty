"use client";

import { useState } from "react";
import { CardCompact } from "@/components/card-compact";
import { CommentCreateForm } from "./comment-create-form";
import { CommentItem } from "./comment-item";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentWithMetaData } from "../types";
import { getComments } from "../queries/get-comments";
import { Button } from "@/components/ui/button";

type CommentsProps = {
    ticketId: string;
    paginatedComments: {
        list: CommentWithMetaData[];
        metadata: { count: number; hasNextPage: boolean };
    };
};

const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
    const [comments, setComments] = useState(paginatedComments.list);
    const [metadata, setMetadata] = useState(paginatedComments.metadata);

    const handleMore = async() => {
        const morePaginatedComments = await getComments(ticketId, comments.length);
        const moreComments = morePaginatedComments.list;

        setComments([...comments, ...moreComments]);
        setMetadata(morePaginatedComments.metadata);
    };

    return (
        <>
            <CardCompact
                title="Create Comment"
                description="A new comment will be created"
                content={<CommentCreateForm ticketId={ticketId} />}
            />

            <div className="flex flex-col gap-y-2 ml-8">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        buttons={[
                            ...(comment.isOwner
                            ? [<CommentDeleteButton key="0" id={comment.id} />]
                            : []),
                        ]}
                    />
                ))}  
            </div>

            <div className="flex flex-col justify-center ml-8">
                {metadata.hasNextPage && (<Button
                    variant="ghost"
                    onClick={handleMore}
                >
                    Load More
                </Button>)}
            </div>
        </>
    );
};

export { Comments };