import { GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { FunnelStage, User } from "../interfaces";
import { getStageLabel } from "./stage-label.helper";
import dayjs from "dayjs";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import axiosAPI from "../config/api.config";

const EditInputCell = (funnelStages: FunnelStage[], { id, value, api, field }: GridRenderCellParams<User, any, any, GridTreeNodeWithRender>) => {
    const convertedValue = funnelStages.find(stage => stage.name === value)?.id;

    const handleChange = async(event: SelectChangeEvent) => {
        try {
            api.setEditCellValue({ id, field, value: event.target.value });
            api.stopCellEditMode({ id, field });
            await axiosAPI.post(`/user/stage-change/${id}`, { stageId: event.target.value });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Select
            value={(typeof value === "string" ? convertedValue : value) || ''}
            onChange={handleChange}
            fullWidth
            size="small"
        >
            {funnelStages.map(stage => {
                return (
                    <MenuItem key={stage.id} value={stage.id}>
                        {stage.name}
                    </MenuItem>
                )
            })}
        </Select>
    );
};

export const columns = (funnelStages: FunnelStage[]): GridColDef<User>[] => {
    return [
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
            editable: true,
            renderEditCell: (params) => EditInputCell(funnelStages, params),
        },
        {
            field: 'createdAt',
            headerName: 'Current Stage',
            width: 200,
            valueGetter: (value, row) => dayjs(new Date(value)).format("YYYY-MM-DDTHH:mm"),
        },
    ];
}