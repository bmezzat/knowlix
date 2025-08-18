import { Box } from "@mui/material";
import { availableApis } from "@/config/api";
import { useDispatch, useSelector } from "react-redux";
import { toggleApi, reorderApis } from "@/store/apiSlice";
import { RootState } from "@/store";
import SortableCard from "./SortableCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";


export const Sidebar = () => {
  const dispatch = useDispatch();
  const { activeApis, orderAPIs } = useSelector((state: RootState) => state.api);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderAPIs.indexOf(active.id);
      const newIndex = orderAPIs.indexOf(over.id);
      const newOrder = arrayMove(orderAPIs, oldIndex, newIndex);
      dispatch(reorderApis(newOrder));
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
        p: 2,
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={orderAPIs} strategy={verticalListSortingStrategy}>
          {orderAPIs.map((id) => {
            const api = availableApis.find((a) => a.id === id)!;
            const isActive = activeApis.includes(id);
            return (
              <SortableCard
                key={api.id}
                api={api}
                checked={isActive}
                onToggle={() => dispatch(toggleApi(api.id))}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </Box>
  );
}
