"use client";
import { useCallback, useState } from "react";
import ReactFlow, {
  Node,
  MiniMap,
  addEdge,
  Controls,
  Background,
  Connection,
  getIncomers,
  getOutgoers,
  useNodesState,
  useEdgesState,
  getConnectedEdges,
} from "reactflow";
import "reactflow/dist/style.css";
import { FormData } from "@/components/MyForm";
import Sidebar from "@/components/Sidebar";
export default function FlowGraph() {
  const [editValues, setEditValues] = useState<Node | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(true);
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
            animated: true,
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

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  };

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);
          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );
          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

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
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
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
