import type { Principal } from "@icp-sdk/core/principal";

// Note: This Email Writing Assistant is a frontend-only application.
// No backend interface is required or used for core functionality.
// All templates, conversation logic, and state management are handled in the frontend.

export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
}
