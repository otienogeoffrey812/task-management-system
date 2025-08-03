// import React from 'react';
// import {
//   Drawer,
//   List,
//   ListItemIcon,
//   ListItemText,
//   ListItemButton,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import { Link as RouterLink } from 'react-router-dom';

// interface SidebarProps {
//   isOpen: boolean;
//   closeSidebar: () => void;
// }

// const drawerWidth = 240;

// const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const drawerContent = (
//     <List>
//       <ListItemButton component={RouterLink} to="/dashboard" onClick={closeSidebar}>
//         <ListItemIcon>
//           <DashboardIcon />
//         </ListItemIcon>
//         <ListItemText primary="Dashboard" />
//       </ListItemButton>
//       <ListItemButton component={RouterLink} to="/tasks" onClick={closeSidebar}>
//         <ListItemIcon>
//           <AssignmentIcon />
//         </ListItemIcon>
//         <ListItemText primary="Tasks" />
//       </ListItemButton>
//     </List>
//   );

//   return isMobile ? (
//     <Drawer
//       variant="temporary"
//       open={isOpen}
//       onClose={closeSidebar}
//       ModalProps={{ keepMounted: true }}
//       sx={{
//         [`& .MuiDrawer-paper`]: {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           top: 64,
//           height: 'calc(100% - 64px)',
//         },
//       }}
//     >
//       {drawerContent}
//     </Drawer>
//   ) : (
//     <Drawer
//       variant="permanent"
//       open
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           top: 64,
//           height: 'calc(100% - 64px)',
//         },
//       }}
//     >
//       {drawerContent}
//     </Drawer>
//   );
// };

// export default Sidebar;


import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistIcon from '@mui/icons-material/Checklist';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tasksOpen, setTasksOpen] = useState(true);

  const handleToggleTasks = () => setTasksOpen(!tasksOpen);

  const drawerContent = (
    <List sx={{ width: drawerWidth }}>
      <ListItemButton component={RouterLink} to="/dashboard" onClick={closeSidebar}>
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton onClick={handleToggleTasks}>
        <ListItemIcon><AssignmentIcon /></ListItemIcon>
        <ListItemText primary="Tasks" />
        {tasksOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={tasksOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{ pl: 4 }}
            component={RouterLink}
            to="/tasks"
            onClick={closeSidebar}
          >
            <ListItemIcon><ChecklistIcon /></ListItemIcon>
            <ListItemText primary="All Tasks" />
          </ListItemButton>
          <ListItemButton
            sx={{ pl: 4 }}
            component={RouterLink}
            to="/tasks/pending"
            onClick={closeSidebar}
          >
            <ListItemIcon><HourglassEmptyIcon /></ListItemIcon>
            <ListItemText primary="Pending Tasks" />
          </ListItemButton>
          <ListItemButton
            sx={{ pl: 4 }}
            component={RouterLink}
            to="/tasks/completed"
            onClick={closeSidebar}
          >
            <ListItemIcon><CheckCircleIcon /></ListItemIcon>
            <ListItemText primary="Completed Tasks" />
          </ListItemButton>
          <ListItemButton
            sx={{ pl: 4 }}
            component={RouterLink}
            to="/tasks/cancelled"
            onClick={closeSidebar}
          >
            <ListItemIcon><CancelIcon /></ListItemIcon>
            <ListItemText primary="Cancelled Tasks" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={closeSidebar}
      ModalProps={{ keepMounted: true }}
      sx={{
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          top: 64,
          height: 'calc(100% - 64px)',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          top: 64,
          height: 'calc(100% - 64px)',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;