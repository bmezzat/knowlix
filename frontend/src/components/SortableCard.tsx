import { Box, Card, CardContent, CardHeader, Switch, Typography } from "@mui/material";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


const SortableCard = ({ api, checked, onToggle }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: api.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "5px",
    width: 'inherit',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card sx={{ mb: 2, ml: 2, width: '90%' }} variant="outlined">
        <CardHeader
          title={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{api.name}</Typography>
              <Switch
                data-testid={`switch-${api.id}`}
                checked={checked} 
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onChange={() => {
                    console.log('trigger on tohhle')
                    onToggle();
                }} 
              />
            </Box>
          }
        />
        <CardContent>
          <Typography variant="caption" color="text.secondary"  sx={{ display: "block", mt: -2 }}>
            Commands: {api.commands.join(", ")}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default SortableCard;
