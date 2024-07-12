import { ElementDefinition } from "cytoscape";

/**
 * Function to create a node collection used for the graph creation.
 * @param numberOfNodes The number of nodes the graph will have
 * @returns An array containing the information of every node created
 */
const createNodes = (numberOfNodes: number): ElementDefinition[] =>
  Array.from({ length: numberOfNodes }, (_, i) => ({
    group: "nodes",
    data: { id: `${i}` },
  }));

/**
 * Function to create a unique edge identifier.
 * @param source The source node ID
 * @param target The target node ID
 * @returns A string representing the edge identifier
 */
const createEdgeId = (source: number, target: number): string =>
  `e${source}to${target}`;

/**
 * Function to create edges collection without duplicates.
 * @param adjacencyList The adjacency list used to connect the nodes
 * @returns An array containing the information of all the edges for the graph
 */
const createEdges = (adjacencyList: number[][]): ElementDefinition[] => {
  const edgeSet = new Set<string>();

  adjacencyList.forEach((targets, source) => {
    targets.forEach((target) => {
      const edgeId = createEdgeId(source, target);
      const reverseEdgeId = createEdgeId(target, source);
      if (!edgeSet.has(reverseEdgeId)) {
        edgeSet.add(edgeId);
      }
    });
  });

  return Array.from(edgeSet).map((edgeId) => {
    const [source, target] = edgeId.slice(1).split("to").map(Number);
    return {
      group: "edges",
      data: { source, target, id: edgeId },
    };
  });
};

/**
 * Function to generate the adjacency list for the graph.
 * @param numberOfNodes The number of nodes the graph will have
 * @param complexity The complexity factor for the graph. It is translated in how complex the edge's connections the graph will have
 * @returns An adjacency list representing the graph connections.
 */
const generateAdjacencyList = (
  numberOfNodes: number,
  complexity: number
): number[][] =>
  Array.from({ length: numberOfNodes }, () =>
    Array.from({ length: complexity * 10 }, () =>
      Math.floor(Math.random() * numberOfNodes)
    )
  ).map((connections) => Array.from(new Set(connections)));

/**
 * Function to create all the nodes and edges information for the creation of the graph.
 * @param numberOfNodes The number of nodes the graph will have
 * @param complexity The complexity factor for the graph. It is translated in how complex the edge's connections the graph will have
 * @returns An array containing all the nodes and edges information for the creation of the graph
 */
const createGraphElementsCollection = (
  numberOfNodes: number,
  complexity: number
): ElementDefinition[] => {
  const adjacencyList = generateAdjacencyList(numberOfNodes, complexity);
  const nodeElements = createNodes(numberOfNodes);
  const edgeElements = createEdges(adjacencyList);

  return [...nodeElements, ...edgeElements];
};

/**
 * Function to create the elements of a graph.
 * @param numberOfNodes The number of nodes the graph will have
 * @param complexity The complexity degree for the graph
 * @returns An array containing all the nodes and edges information for the creation of the graph
 */
export const createGraph = (
  numberOfNodes: number,
  complexity: number
): ElementDefinition[] =>
  createGraphElementsCollection(numberOfNodes, complexity);
