import { createRef, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import ApiPanel from "./ApiPanel";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { availableApis } from "@/config/api";


export default function PanelContainer() {
  const { activeApis, orderAPIs } = useSelector((state: RootState) => state.api);
  const panelMessages = useSelector((state: RootState) => state.chat.panelMessages);

  const activeApiConfigs = orderAPIs
    .filter(id => activeApis.includes(id))
    .map(id => availableApis.find(api => api.id === id)!);

  const nodeRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});  
  return (
    <TransitionGroup>
      
      {activeApiConfigs.map(api => {
        if (!nodeRefs.current[api.id]) {
          nodeRefs.current[api.id] = createRef<HTMLDivElement>();
        }
        const nodeRef = nodeRefs.current[api.id];
        return (
          <CSSTransition
            key={api.id}
            timeout={300}
            classNames="panel"
            nodeRef={nodeRef}
          >
            <div
              ref={nodeRef}
              style={{
                marginTop: 30,
                marginLeft: 20,
                marginRight: 20,
                boxSizing: 'border-box',
              }}
            >              
              <ApiPanel api={api} messages={panelMessages[api.id] || []}/>
            </div>
          </CSSTransition>
        );  
      })}
    </TransitionGroup>
  );
}
