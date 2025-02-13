"use client";
import { useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Node,
  Connection,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { FormData } from "@/components/MyForm";
import Sidebar from "@/components/Sidebar";

export default function FlowGraph() {
  const [editValues, setEditValues] = useState<Node | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const addNode = (data: FormData) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      data: { ...data, label: data.name, type: data.name },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((nds) => [...nds, newNode]);
    if (nodes.length > 0) {
      setEdges((eds) =>
        addEdge(
          {
            id: `e${nodes.length}-${nodes.length + 1}`,
            source: nodes[nodes.length - 1].id,
            target: newNode.id,
          },
          eds
        )
      );
    }
  };

  const updateNode = (updatedData: FormData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === editValues?.id
          ? { ...node, data: { ...updatedData, label: updatedData.name } }
          : node
      )
    );
    setEditValues(undefined);
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setIsOpen(true);
    setEditValues(node);
  };

  const onConnect = (connection: Connection) =>
    setEdges((eds) => addEdge(connection, eds));

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        addNode={addNode}
        editValues={editValues}
        updateNode={updateNode}
        setEditValues={setEditValues}
      />
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  );
}
