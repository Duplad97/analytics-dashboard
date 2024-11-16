import { Container, Box, Typography, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid, GridFilterModel, GridPaginationModel, GridRowSelectionModel, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { FunnelStage, User } from "../../interfaces";
import api from "../../config/api.config";
import { columns } from "../../_helper/users-columns";
import UserFormDialog from "./user-form-dialog.component";
import { Refresh } from "@mui/icons-material";

function UsersTable() {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [funnelStages, setFunnelStages] = useState<FunnelStage[]>([]);
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [filter, setFilter] = useState<string>("");
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [showUserFormDialog, setShowUserFormDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

    useEffect(() => {
        getFunnelStages();
        getUsers();
    }, [])

    useEffect(() => {
        getUsers();
    }, [page, pageSize, filter])

    const getUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get("/user", {
                params: {
                    page: page + 1,
                    pageSize,
                    filter
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

    const handlePaginationChange = (pagination: GridPaginationModel) => {
        setPage(pagination.page);
        setPageSize(pagination.pageSize);
    }

    const handleRowSelectionChange = (rowSelection: GridRowSelectionModel) => {
        setSelectedRows(rowSelection as number[]);
    }

    const handleFilterChange = (filter: GridFilterModel) => {
        setFilter(filter.quickFilterValues ? filter.quickFilterValues[0] : "");
    }

    const handleDeleteUsers = async () => {
        try {
            await api.delete("/user", { data: { userIds: selectedRows } });
            setShowDeleteDialog(false);
            setUsers((prevState) => {
                return prevState.filter((user) => !selectedRows.includes(user.id));
            });
            setTotalRows((prevState) => prevState - selectedRows.length);
            setSelectedRows([]);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <Container>
            <Box my={3}>
                <Typography variant="h4" gutterBottom>
                    Users
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Here you can add and remove users, or edit their stage in the funnel.
                </Typography>
                <Paper elevation={3} style={{ width: '100%', marginTop: '16px', padding: '15px' }}>
                    <Box display={"flex"} mb={2} justifyContent={"end"}>
                        {selectedRows.length > 0 && 
                        <Button sx={{ marginRight: 2}} variant="outlined" onClick={() => setShowDeleteDialog(true)}>{`Delete (${selectedRows.length})`}</Button>}

                        <Button sx={{ marginRight: 2}} variant="contained" onClick={() => setShowUserFormDialog(true)}>Add new</Button>

                        <IconButton onClick={getUsers}>
                            <Refresh />
                        </IconButton>
                    </Box>
                    <DataGrid
                        sx={{ maxWidth: "85vw" }}
                        loading={loading} columns={columns(funnelStages)}
                        rows={users} pageSizeOptions={[15, 50, 100]}
                        rowCount={totalRows}
                        pagination
                        paginationModel={{ pageSize, page }}
                        onPaginationModelChange={handlePaginationChange}
                        paginationMode="server"
                        checkboxSelection
                        onRowSelectionModelChange={handleRowSelectionChange}
                        onFilterModelChange={handleFilterChange}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                </Paper>
            </Box>
        </Container>
        <UserFormDialog setUsers={setUsers} open={showUserFormDialog} handleClose={() => setShowUserFormDialog(false)} funnelStages={funnelStages} />
            <Dialog open={showDeleteDialog}>
                <DialogTitle>
                    Confirm Delete Users
                </DialogTitle>
                <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to delete <b>{selectedRows.length}</b> user(s)?
                </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleDeleteUsers}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default UsersTable;