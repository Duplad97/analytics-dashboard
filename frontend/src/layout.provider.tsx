import { AppProvider, DashboardLayout, Navigation, Router } from "@toolpad/core";
import { Route, Routes, useNavigate } from "react-router-dom";
import { router } from "./config/router";
import { createTheme } from "@mui/material";
import { Dashboard, People } from "@mui/icons-material";

const NAVIGATION: Navigation = [
    {
        segment: '',
        title: 'Dashboard',
        icon: <Dashboard />,
    },
    {
        segment: 'users',
        title: 'Users',
        icon: <People />,
    },
];

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function LayoutProvider() {
    const navigate = useNavigate();

    const baseRoute: Router = {
        pathname: '/',
        searchParams: new URLSearchParams(),
        navigate: (path) => navigate(path),
    }

    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                title: 'Analytics Dashboard',
            }}
            router={baseRoute}
            theme={theme}
        >
            <DashboardLayout>
                <Routes>
                    {router.map(route => {
                        return <Route key={Math.random()} path={route.path} Component={route.element} />
                    })}
                </Routes>
            </DashboardLayout>
        </AppProvider>
    )
}
export default LayoutProvider;