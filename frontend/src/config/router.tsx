import FunnelStagesPage from "../pages/funnel-stages.page";
import UsersPage from "../pages/users.page";

export const router = [
    {
        name: "Funnel Stages",
        path: "/",
        element: FunnelStagesPage,
    },
    {
        name: "Users",
        path: "/users",
        element: UsersPage,
    }
];