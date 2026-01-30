import { Box } from "@mui/material";
import { HydroChat } from "@/components/HydroChat";
import { HydroSidebar } from "@/components/HydroSidebar";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <HydroSidebar />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <HydroChat />
      </Box>
    </Box>
  );
}

export default App;
