import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Comment {
    id: bigint;
    displayName: string;
    body: string;
    timestamp: bigint;
    videoId: string;
}
export interface backendInterface {
    deleteComment(commentId: bigint): Promise<boolean>;
    getCommentCount(videoId: string): Promise<bigint>;
    getComments(videoId: string): Promise<Array<Comment>>;
    postComment(videoId: string, displayName: string, body: string): Promise<bigint>;
}
