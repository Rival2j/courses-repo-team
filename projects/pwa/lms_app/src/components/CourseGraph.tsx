import { useMemo } from "react";
import ReactFlow, { Node, Edge, Controls, Background, useNodesState, useEdgesState, Position } from "reactflow";
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
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes: Node[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - 110,
        y: nodeWithPosition.y - 40,
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
              animated: true,
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
