import { Container, Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { FunnelStage, User } from "../../interfaces";
import api from "../../config/api.config";
import dayjs from "dayjs";
import { getStageLabel } from "../../_helper/stage-label.helper";

function UsersTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([]);

    useEffect(() => {
        getFunnelStages();
        getUsers();
    }, [])

    const getUsers = async () => {
        try {
            const response = await api.get("/user");
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getFunnelStages = async () => {
        try {
            const response = await api.get("/stages");
            setFunnelStages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const columns: GridColDef<(typeof users)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 250,
    },
    {
        field: 'currentStageId',
        headerName: 'Current Stage',
        width: 250,
        valueGetter: (value, row) => getStageLabel(value, funnelStages),
    },
    {
        field: 'createdAt',
        headerName: 'Current Stage',
        width: 200,
        valueGetter: (value, row) => dayjs(new Date(value)).format("YYYY-MM-DDTHH:mm"),
    },
  ];

    return (
        <Container>
            <Box my={3}>
                <Typography variant="h4" gutterBottom>
                    Users
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Here you can add, remove or edit users (only stage in funnel).
                </Typography>
                <Paper elevation={3} style={{ width: '100%', marginTop: '16px', padding: '15px' }}>
                    <DataGrid columns={columns} rows={users} />
                </Paper>
            </Box>
        </Container>
    )
}
export default UsersTable;