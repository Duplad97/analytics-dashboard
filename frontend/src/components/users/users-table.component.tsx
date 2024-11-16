import { Container, Box, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { FunnelStage, User } from "../../interfaces";
import api from "../../config/api.config";
import dayjs from "dayjs";
import { getStageLabel } from "../../_helper/stage-label.helper";

function UsersTable() {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(15);

    useEffect(() => {
        getFunnelStages();
        getUsers();
    }, [])

    useEffect(() => {
        getUsers();
    }, [page, pageSize])

    const getUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/user", {
                params: {
                    page: page + 1,
                    pageSize
                }
            });
            setUsers(response.data.users);
            setTotalRows(response.data.totalUsers);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const getFunnelStages = async () => {
        try {
            const response = await api.get("/stages");
            setFunnelStages(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePaginationChange = (pagination:GridPaginationModel) => {
        setPage(pagination.page);
        setPageSize(pagination.pageSize);
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
                    <DataGrid loading={loading} columns={columns} rows={users} pageSizeOptions={[15, 50, 100]} rowCount={totalRows} pagination paginationModel={{pageSize, page}} onPaginationModelChange={handlePaginationChange} paginationMode="server"/>
                </Paper>
            </Box>
        </Container>
    )
}
export default UsersTable;