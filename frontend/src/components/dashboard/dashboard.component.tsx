import React, { useState } from 'react';
import { Tabs, Tab, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BreakdownChart from './breakdown-chart.component';
import { TabData } from '../../interfaces';

function Dashboard() {
    const addTab = (tabData: TabData) => {
        setTabs((prevTabs) => [...prevTabs, tabData]);
        setActiveTab(tabData.id);
    };

    const [tabs, setTabs] = useState<TabData[]>([
        { id: 0, label: 'Breakdown Chart', content: <BreakdownChart addTab={addTab} />, closable: false },
    ]);
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const removeTab = (id: number) => {
        setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
        if (activeTab === id && tabs.length > 1) {
            setActiveTab(tabs[0].id);
        }
    };

    return (
        <Box>
            <Tabs value={activeTab} onChange={handleTabChange}>
                {tabs.map((tab) => (
                    <Tab
                        key={tab.id}
                        label={
                            <Box display="flex" alignItems="center">
                                <Typography>{tab.label}</Typography>
                                {tab.closable && <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTab(tab.id);
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>}
                            </Box>
                        }
                        value={tab.id}
                    />
                ))}
            </Tabs>

            {tabs.map((tab) => (
                <Box
                    key={tab.id}
                    role="tabpanel"
                    hidden={activeTab !== tab.id}
                >
                    {activeTab === tab.id && tab.content}
                </Box>
            ))}
        </Box>
    );
}
export default Dashboard;