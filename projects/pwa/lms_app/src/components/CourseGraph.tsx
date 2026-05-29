import { useMemo } from "react";
import ReactFlow, { Node, Edge, Controls, Background, useNodesState, useEdgesState, Position, MarkerType } from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import type { Course } from "../types";

interface CourseGraphProps {
  courses: Course[];
  learningPathId: string;
  courseIds: string[];
}

function calculateLayout(nodes: Node[], edges: Edge[]) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR", nodesep: 170, ranksep: 140, marginx: 24, marginy: 24 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 240, height: 90 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes: Node[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: {
        x: nodeWithPosition.x - 120,
        y: nodeWithPosition.y - 45,
      },
    };
  });

  return layoutedNodes;
}

export function CourseGraph({ courses, learningPathId, courseIds }: CourseGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = courseIds.map((courseId) => {
      const course = courses.find((c) => c.id === courseId);
      return {
        id: courseId,
        data: {
          label: (
            <div className="course-node">
              <p className="course-node-title">{course?.title}</p>
              <p className="course-node-meta">{course?.difficulty}</p>
            </div>
          ),
        },
        position: { x: 0, y: 0 },
      };
    });

    const edges: Edge[] = [];

    courseIds.forEach((courseId) => {
      const course = courses.find((c) => c.id === courseId);
      if (course?.prerequisiteCourseIds) {
        course.prerequisiteCourseIds.forEach((prereqId) => {
          if (courseIds.includes(prereqId)) {
            edges.push({
              id: `${prereqId}->${courseId}`,
              source: prereqId,
              target: courseId,
              type: "smoothstep",
              animated: false,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              style: {
                stroke: "#2563eb",
                strokeWidth: 2,
              },
            });
          }
        });
      }
    });

    const layoutedNodes = calculateLayout(nodes, edges);

    return {
      nodes: layoutedNodes,
      edges,
    };
  }, [courseIds, courses]);

  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div className="course-graph-container">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
