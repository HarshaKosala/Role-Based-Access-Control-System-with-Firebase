export interface User {
    uid : string;
    email : string;
    displayName? : string;
    photoURL? : string;
    roles: Roles;
}

export interface Roles{
    Subscriber: boolean;
    Admin: boolean;
    Editor: boolean;
}
