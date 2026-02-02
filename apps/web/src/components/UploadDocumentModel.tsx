import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloudUploadIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useDocument } from "@/hooks/useDocument";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const UploadDocumentModel = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadDocument } = useDocument();

  const dropzoneStyles = useMemo(
    () => ({
      border: "1px dashed",
      borderColor: isDragging ? "primary.main" : "divider",
      borderRadius: 2,
      px: 3,
      py: 4,
      textAlign: "center",
      backgroundColor: isDragging ? "action.hover" : "background.paper",
      transition: "border-color 160ms ease, background-color 160ms ease",
    }),
    [isDragging],
  );

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadDocument(files[0]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Documents</DialogTitle>
      <DialogContent>
        <Box
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          sx={dropzoneStyles}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ fontSize: 14, color: "text.secondary" }}>
              Drag and drop files here or use the button below
            </Box>
            <Button
              component="label"
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ alignSelf: "center" }}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => handleFiles(event.target.files)}
                multiple
              />
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
