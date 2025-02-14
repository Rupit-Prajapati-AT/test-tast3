"use client";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
import Sidebar from "@/components/Sidebar";
import { FormData } from "@/components/Form";
export default function FlowGraph() {
  const [editValues, setEditValues] = useState<Node | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /**
   * Updates an existing node if `editValues` is set, otherwise creates a new node.
   *
   * If updating, the function maps over the current nodes, updating the node with
   * the same id as `editValues` by replacing its data with the provided `data`, and
   * sets `editValues` to undefined.
   *
   * If creating, a new node is generated with a unique id, random position, and
   * the provided `data`. The new node is added to the nodes state. If there are
   * existing nodes, an edge is created connecting the last node and the new node.
   *
   * @param {FormData} data - The data used to update an existing node or create a new node.
   */

  const upsertNode = (data: FormData) => {
    if (editValues) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editValues?.id
            ? { ...node, data: { ...data, label: data.name } }
            : node
        )
      );
      setEditValues(undefined);
    } else {
      const newNodeId = uuidv4();
      const newNode: Node = {
        id: newNodeId,
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
    }
  };

  /**
   * Handles the node click event by opening the sidebar and setting
   * the clicked node as the current `editValues`.
   *
   * @param {React.MouseEvent} _ - The mouse event (unused).
   * @param {Node} node - The node that was clicked.
   */

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setIsOpen(true);
    setEditValues(node);
  };

  const onConnect = (connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  };

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEditValues(undefined);
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
              animated: true,
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
        upsertNode={upsertNode}
        editValues={editValues}
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
